#!/usr/bin/python3

import yaml
import glob


class MyDumper(yaml.Dumper):
    def increase_indent(self, flow=False, indentless=False):
        return super(MyDumper, self).increase_indent(flow, False)


sarifFiles = glob.glob('../semgrep_rules/*')
allRules = []

for scanConfig in sarifFiles:
    f = open(scanConfig, 'r')
    print('BORIS: Opened the file:', scanConfig)
    scanConfigData = yaml.safe_load(f)
    allRules += scanConfigData['rules']
    print('BORIS RULES:\n', allRules)

newConfig = {'rules': allRules}
print('BORIS: The new config is\n', newConfig)
outFile = open('semgrep_rules/semgrepRulles.yml', 'w')
outFile.write(yaml.dump(newConfig, Dumper=MyDumper, default_flow_style=False))
outFile.close()
print('Wrote the file')
