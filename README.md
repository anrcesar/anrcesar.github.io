<!--
 \\Author: Thibault Napoléon "Imothep"
 \\Company: ISEN Ouest
 \\Email: thibault.napoleon@isen-ouest.yncrea.fr
 \\Created Date: 16-Sep-2024 - 13:51:38
 \\Last Modified: 19-Dec-2025 - 17:22:54
-->

# CESAR ANR Project website
## Description
The website is designed to present the CESAR ANR project, including project decription, team and partners, events, publications / dissemination and contact. The content is dynamically loaded from JSON files and rendered into the HTML structure using JavaScript. The publications list is loaded from HAL archives website through the given API.

## Files
- **index.html**: The main HTML file that structures the webpage.
- **css/**: Contains all the CSS files for styling the website (Bootstrap, icons and style).
- **fonts/**: Contains icons files used in the website.
- **imgs/**: Directory for images used in the website.
- **js/**: Contains JavaScript files for dynamic content loading and interaction.
  - **load_json.js**: Main JavaScript file responsible for loading and processing JSON data.
- **json/**: Contains JSON files with data for different sections of the website.
  - **project.json**: Project description data.
  - **team_partners.json**: Team and partners data.
  - **events.json**: Events data.
  - **publications.json**: Publications data (filled automatically with HAL archives).
  - **contact.json**: Contact data.
- **tools/**: Contains the tools to validate JSON files.
  - **schemas/**: The JSON schemas for all parts (JSON) of the website.
  - **requirements.txt**: The Python packages requirements.
  - **validate_json.py**: The Python tool to check the validity of the JSON files.

## Development
To modify the website content, update the JSON files in the `json/` directory.

### Libraries
- **Bootstrap**: Used to simplify navbar, grid alignment, badges (https://getbootstrap.com/).
- **Academicons**: Used to display academic social media icons (https://jpswalsh.github.io/academicons/).

*Thibault Napoléon - thibault.napoleon@isen-ouest.yncrea.fr*
