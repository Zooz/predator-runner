#!/usr/bin/python3

import yaml
import glob

tempYaml = []
for ruleFile in glob.glob('semgrep_rules/*'): 
    print(ruleFile)
    tempYaml.append(yaml.full_load(open(ruleFile))['rules'])

file = open('file.yml', 'w')
yaml.dump(tempYaml, file)
file.close()