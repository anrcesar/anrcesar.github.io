#!/home/napoleon/.PythonEnvs/Base/bin/python3
###
# \\Author: Thibault Napoléon "Imothep"
# \\Company: ISEN Ouest
# \\Email: thibault.napoleon@isen-ouest.yncrea.fr
# \\Created Date: 19-Nov-2025 - 18:49:30
# \\Last Modified: 07-Jan-2026 - 12:24:04
###

"""JSON validator script."""

# Imports.
import json
import jsonschema  # type: ignore
import os


# Constants.
DATA = {
    'Contact':
        ['../json/contact.json', 'schemas/contact.json'],
    'Events':
        ['../json/events.json', 'schemas/events.json'],
    'Home':
        ['../json/home.json', 'schemas/home.json'],
    'Project':
        ['../json/project.json', 'schemas/project.json'],
    'Publications and Disseminations':
        ['../json/publications_disseminations.json',
         'schemas/publications_disseminations.json'],
    'Team and Experts':
        ['../json/team_experts.json', 'schemas/team_experts.json']
}
OK = '\033[92m'
FAIL = '\033[91m'


def loadJSON(json_file):
    """Load and parse a JSON file."""
    if not os.path.exists(json_file):
        return False, FAIL + 'The JSON file ' + json_file + ' doesn\'t exists.'
    try:
       json_data = json.load(open(json_file))
    except json.decoder.JSONDecodeError:
        return False, FAIL + 'Unable to parse the JSON file ' + json_file
    return True, json_data


def validateJSON(json_file, schema_file):
    """Validate a JSON file accordingly to a JSON schema."""
    state, json_data = loadJSON(json_file)
    if not state:
        return False, json_data
    state, json_schema = loadJSON(schema_file)
    if not state:
        return False, json_schema

    # Validate the JSON file.
    try:
        jsonschema.validate(instance=json_data, schema=json_schema)
    except jsonschema.ValidationError as e:
        return False, (FAIL + 'JSON file' + json_file +
                       ' is not valid accordingly to ' + schema_file + ': '+
                       e.message)
    return True, None


# Main program.
for key in DATA:
    state, message = validateJSON(*DATA[key])
    if state:
        print(OK +  key + ' OK')
    else:
        print(FAIL + key + ' KO (' + message + ')')
