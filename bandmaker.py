import sys, json, tabulate, csv

from pathlib import Path
from pprint import pprint

data = json.loads(Path(sys.argv[1]).read_text())

bands = data['props']['pageProps']['bands']

bands2 = sorted(bands, key=lambda band: (band['day'], band['startTime']))

# pprint(bands2)
# print(json.dumps(bands2, indent=4))
# print(tabulate.tabulate(bands))
csv_writer = csv.DictWriter(sys.stdout, fieldnames=bands2[0].keys(), extrasaction="ignore")
csv_writer.writeheader()
csv_writer.writerows(bands2)