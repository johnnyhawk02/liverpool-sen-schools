from bs4 import BeautifulSoup
import json
import re
import html

# Read the HTML content from the file
try:
    with open('shortlist.html', 'r', encoding='utf-8') as f:
        html_content = f.read()
except FileNotFoundError:
    print("Error: shortlist.html not found.")
    exit()

# Remove the START/END markers if they are present in the file
html_content = html_content.replace("--- START OF FILE shortlist.html ---", "").replace("--- END OF FILE ---", "").strip()

# Parse the HTML
soup = BeautifulSoup(html_content, 'html.parser')

schools_data = []

# Find the main results list
results_list = soup.select_one('ol.results-list-accordion')

if results_list:
    # Find all article tags within the results list, each representing a school
    school_articles = results_list.select('article.result_hit')

    # For debugging - store descriptions for examination
    debug_descriptions = []
    
    for article in school_articles:
        school = {}
        school_id = article.get('id')  # Get the ID of the article for reference

        # --- Extract name from h2 ---
        h2 = article.find('h2')
        if h2:
            link = h2.find('a')
            if link:
                school['name'] = link.get_text(strip=True)
            else:
                # Fallback if h2 doesn't contain a link (unlikely based on structure)
                school['name'] = h2.get_text(strip=True)
        else:
            school['name'] = None

        # --- Extract info from the visible collapse div (summary) ---
        summary_div = article.find('div', class_='collapse show')
        if summary_div:
            # Extract opening times/status from font-weight-bold div
            font_bold = summary_div.find('div', class_='font-weight-bold')
            if font_bold:
                school['summary_bold_info'] = font_bold.get_text(" ", strip=True)
            else:
                school['summary_bold_info'] = ""

            # Extract truncated description (for fallback only)
            description_parts = []
            for child in summary_div.children:
                if child.name == 'span' and 'comma_split_line' in child.get('class', []):
                    break # Stop when we hit address spans
                if isinstance(child, str) and child.strip():
                    description_parts.append(child.strip())
                elif child.name == 'div' and child != font_bold: # Include other non-bold divs if any
                    description_parts.append(child.get_text(" ", strip=True))

            summary_description = " ".join(description_parts).strip()
            
            # Check if description is truncated
            is_truncated = summary_description.endswith('\u2026')  # Unicode ellipsis

            # Extract address summary
            address_spans = summary_div.select('span.comma_split_line')
            address_lines = [span.get_text(strip=True) for span in address_spans]
            school['address_summary'] = ", ".join(address_lines)

        else:
            school['summary_bold_info'] = ""
            summary_description = ""
            school['address_summary'] = ""
            is_truncated = False

        # --- Extract email and website from footer links ---
        footer = article.find('div', class_='footer')
        school['email'] = ""
        school['url'] = ""  # Changed from 'website' to 'url' to match schools.ts format
        if footer:
            for link in footer.select('a'):
                link_text = link.get_text(strip=True)
                link_href = link.get('href')
                
                if link_href and 'Email' in link_text and link_href.startswith('mailto:'):
                    school['email'] = link_href.replace('mailto:', '')
                
                if link_href and 'Website' in link_text and not link_href.startswith('mailto:'):
                    school['url'] = link_href
        
        # --- Extract telephone numbers ---
        school['phone'] = []
        
        # Extract all telephone links from the entire article
        tel_links = article.select('a[href^="tel:"]')
        for tel_link in tel_links:
            href = tel_link.get('href', '')
            if href.startswith('tel:'):
                tel_number = href.replace('tel:', '')
                # Skip empty or very short numbers and fax numbers
                if tel_number and len(tel_number) > 5:
                    # Get the visible text which has proper formatting
                    text = tel_link.get_text(strip=True)
                    if text and re.search(r'\d', text) and not 'fax' in text.lower():
                        # Clean the text (remove any prefix like "tel:" or ":")
                        clean_text = re.sub(r'^[^0-9]*', '', text)
                        if clean_text:
                            school['phone'].append(clean_text)
                    else:
                        # If no good text, format the href value
                        formatted = re.sub(r'(\d{4})(\d{3})(\d{4})', r'\1 \2 \3', tel_number)
                        formatted = re.sub(r'(\d{5})(\d{6})', r'\1 \2', formatted)
                        school['phone'].append(formatted)
        
        # If no phone numbers found from links, try finding Telephone dt/dd pairs
        if not school['phone']:
            telephone_dts = article.find_all('dt', string=lambda s: s and ('Telephone' in s))
            for dt in telephone_dts:
                dd = dt.find_next_sibling('dd')
                if dd:
                    # Try to find spans with phone numbers
                    for span in dd.find_all('span'):
                        text = span.get_text(strip=True)
                        if text and re.search(r'\d', text) and 'fax' not in text.lower():
                            # Remove any prefix
                            clean_text = re.sub(r'^[^0-9]*', '', text)
                            if clean_text:
                                school['phone'].append(clean_text)
                    
                    # If no spans found, try direct text
                    if not school['phone']:
                        text = dd.get_text(strip=True)
                        if text and re.search(r'\d', text):
                            # Extract potential phone patterns
                            matches = re.findall(r'(?:\+\d{1,3}|0\d{1,4})[\s-]?\d{3,4}[\s-]?\d{3,4}', text)
                            for match in matches:
                                if 'fax' not in text.lower():
                                    school['phone'].append(match)
        
        # Remove duplicates from phone list
        if school['phone']:
            # Clean each phone to ensure consistent format
            cleaned_phones = []
            for phone in school['phone']:
                # Only keep digits, spaces, and plus sign
                digits_only = re.sub(r'[^\d\s+]', '', phone).strip()
                if digits_only:
                    cleaned_phones.append(digits_only)
            
            # Remove duplicates
            school['phone'] = list(dict.fromkeys(cleaned_phones))

        # --- Find full description in detailed div ---
        full_description = ""
        
        # Get the detailed div that contains expanded information
        detailed_div = article.find('div', class_='collapse', id=school_id)
        
        if detailed_div:
            # APPROACH 1: Look for detailed info sections
            all_details = detailed_div.find_all('details', class_='field_section')
            
            for details in all_details:
                summary_tag = details.find('summary')
                if not summary_tag:
                    continue
                
                summary_text = summary_tag.get_text(strip=True)
                
                # Check for sections that typically contain descriptions
                if any(keyword in summary_text for keyword in [
                    'About', 'Description', 'Local Offer', 'Overview', 'Information',
                    'Service', 'School', 'Provision', 'Details'
                ]):
                    # Find definition lists in this section
                    dl = details.find('dl')
                    if dl:
                        # Look for description terms
                        for dt in dl.find_all('dt'):
                            dt_text = dt.get_text(strip=True).lower()
                            
                            # Check for terms indicating a description
                            if any(keyword in dt_text for keyword in [
                                'description', 'about', 'overview', 'information',
                                'detail', 'service', 'provision', 'offer', 'school'
                            ]):
                                dd = dt.find_next_sibling('dd')
                                if dd:
                                    text = dd.get_text(strip=True)
                                    if text and len(text) > len(full_description):
                                        full_description = text
            
            # APPROACH 2: If still no description, find the longest content in any dd tag
            if not full_description or len(full_description) < 100:
                all_dds = detailed_div.find_all('dd')
                for dd in all_dds:
                    text = dd.get_text(strip=True)
                    # Check if text is likely a description (not a URL, phone, etc.)
                    if len(text) > 150 and not text.startswith(('http', 'www')) and not re.match(r'^[\d\s\+\-\(\)]+$', text):
                        if len(text) > len(full_description):
                            full_description = text
        
        # Use the best description we found, or fall back to summary
        if full_description and (len(full_description) > len(summary_description) or is_truncated):
            # Clean up the description
            full_description = full_description.replace('\n', ' ')
            full_description = re.sub(r'\s+', ' ', full_description)
            full_description = re.sub(r'&nbsp;', ' ', full_description)
            school['summary_description'] = full_description.strip()
            
            # For debugging
            debug_descriptions.append({
                "name": school['name'],
                "found_full": True,
                "length": len(full_description)
            })
        else:
            # Fall back to the summary description
            school['summary_description'] = summary_description
            
            # Clean up truncated text
            if school['summary_description'].endswith('\u2026'):  # Unicode ellipsis
                school['summary_description'] = school['summary_description'][:-1] + '...'
            
            # For debugging
            debug_descriptions.append({
                "name": school['name'],
                "found_full": False,
                "truncated": is_truncated,
                "length": len(summary_description),
                "sample": summary_description[:50]
            })

        schools_data.append(school)

# Output debugging info to separate file for analysis
with open('debug_descriptions.json', 'w', encoding='utf-8') as f:
    json.dump(debug_descriptions, f, indent=2, ensure_ascii=False)

# Format the TypeScript output
ts_output = "const schools = " + json.dumps(schools_data, indent=2, ensure_ascii=False) + ";\n\n"
ts_output += "export type School = {\n"
ts_output += "  name: string;\n"
ts_output += "  phone: string[];\n"
ts_output += "  url: string;\n"
ts_output += "  summary_bold_info?: string;\n"
ts_output += "  summary_description?: string;\n"
ts_output += "  address_summary?: string;\n"
ts_output += "  email?: string;\n"
ts_output += "};\n\n"
ts_output += "export default schools;"

# Write to schools.ts
with open('../src/data/updated_schools.ts', 'w', encoding='utf-8') as f:
    f.write(ts_output)

# Also output JSON for compatibility
print(json.dumps(schools_data, indent=4, ensure_ascii=False)) 