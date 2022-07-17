#!/usr/bin/python3

import yaml
import glob
# import json
# import collections

class MyDumper(yaml.Dumper):

    def increase_indent(self, flow=False, indentless=False):
        return super(MyDumper, self).increase_indent(flow, False)


# sarifFiles = glob.glob('*.sarif')
# print(sarifFiles)

# allRuns = []
# allRules = []

# for report in sarifFiles:
#     f = open(report, 'r')
#     data = json.load(f)
#     if len(data['runs'][0]['results']) > 0:
#         allRuns += data['runs'][0]['results']
#         allRules += data['runs'][0]['tool']['driver']['rules']
#     f.close() 

# if len(allRuns) > 0:
#     tempReport = open(sarifFiles[0], 'r')
#     tempData = json.load(tempReport)

#     # tempData.append(allRuns)
#     print(tempData['runs'][0]['results'])
#     tempReport.close()

sarifFiles = glob.glob('../semgrep_rules/*')
allRules = []

for scanConfig in sarifFiles:
    f = open(scanConfig, 'r')
    scanConfigData = yaml.safe_load(f)
    allRules += scanConfigData['rules']

newConfig = {'rules': allRules}
outFile = open('../semgrep_rules/semgrepRulles.yml', 'w')
outFile.write(yaml.dump(newConfig,Dumper=MyDumper, default_flow_style=False))
outFile.close()