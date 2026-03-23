import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from models import Circuit, Node

CIRCUITS = [
    Circuit(id="1st",  color="#E8927C", states=["ME","MA","NH","RI","PR"]),
    Circuit(id="2nd",  color="#F2C078", states=["CT","NY","VT"]),
    Circuit(id="3rd",  color="#A8D5BA", states=["DE","NJ","PA","VI"]),
    Circuit(id="4th",  color="#7EC8E3", states=["MD","NC","SC","VA","WV"]),
    Circuit(id="5th",  color="#C3A6D8", states=["LA","MS","TX"]),
    Circuit(id="6th",  color="#F7A4A4", states=["KY","MI","OH","TN"]),
    Circuit(id="7th",  color="#B5D99C", states=["IL","IN","WI"]),
    Circuit(id="8th",  color="#FFD6A5", states=["AR","IA","MN","MO","NE","ND","SD"]),
    Circuit(id="9th",  color="#FFB3B3", states=["AK","AZ","CA","HI","ID","MT","NV","OR","WA","GU","MP"]),
    Circuit(id="10th", color="#A5C9F1", states=["CO","KS","NM","OK","UT","WY"]),
    Circuit(id="11th", color="#D4A5E8", states=["AL","FL","GA"]),
    Circuit(id="D.C.", color="#E8D4A5", states=["DC"]),
]

STATE_FIPS = {
    "AL":"01","AK":"02","AZ":"04","AR":"05","CA":"06","CO":"08","CT":"09","DE":"10","DC":"11","FL":"12",
    "GA":"13","HI":"15","ID":"16","IL":"17","IN":"18","IA":"19","KS":"20","KY":"21","LA":"22","ME":"23",
    "MD":"24","MA":"25","MI":"26","MN":"27","MS":"28","MO":"29","MT":"30","NE":"31","NV":"32","NH":"33",
    "NJ":"34","NM":"35","NY":"36","NC":"37","ND":"38","OH":"39","OK":"40","OR":"41","PA":"42","RI":"44",
    "SC":"45","SD":"46","TN":"47","TX":"48","UT":"49","VT":"50","VA":"51","WA":"53","WV":"54","WI":"55","WY":"56",
}

NODES = [
    # 1st Circuit
    Node(city="Boston, MA",         circuit="1st", lat=42.36, lng=-71.06, rationale="High-density immigrant populations; progressive courts favorable to civil rights claims."),
    Node(city="Providence, RI",     circuit="1st", lat=41.82, lng=-71.41, rationale="Very active federal civil-rights docket; Brown University and hospital systems generate employment and discrimination cases."),
    Node(city="Portland, ME",       circuit="1st", lat=43.66, lng=-70.26, rationale="Smaller bar means less competition; strong wrongful arrest and maritime injury cases."),
    # 2nd Circuit
    Node(city="New York City / Brooklyn, NY", circuit="2nd", lat=40.68, lng=-73.94, rationale="Massive immigration dockets; high volume of municipal liability and police misconduct claims."),
    Node(city="Buffalo, NY",        circuit="2nd", lat=42.89, lng=-78.88, rationale="Border enforcement litigation; ICE detention and immigration suits."),
    Node(city="Hartford, CT",       circuit="2nd", lat=41.77, lng=-72.68, rationale="Insurance litigation hub; strong employment discrimination cases."),
    # 3rd Circuit
    Node(city="Philadelphia / Newark", circuit="3rd", lat=40.00, lng=-75.13, rationale="Dense urban civil rights claims; Newark holds 90K+ pending EOIR immigration cases."),
    Node(city="Pittsburgh, PA",     circuit="3rd", lat=40.44, lng=-80.00, rationale="Police misconduct cases; active medical malpractice ecosystem."),
    Node(city="Camden, NJ",         circuit="3rd", lat=39.93, lng=-75.12, rationale="Historically troubled police department creates a deep civil-rights litigation pipeline."),
    # 4th Circuit
    Node(city="Alexandria / Baltimore", circuit="4th", lat=39.28, lng=-76.62, rationale="Federal agency proximity; Alexandria 'Rocket Docket'; heavy police misconduct volume."),
    Node(city="Richmond, VA",       circuit="4th", lat=37.54, lng=-77.44, rationale="State capital — constitutional litigation and prisoner civil-rights claims."),
    Node(city="Charlotte, NC",      circuit="4th", lat=35.23, lng=-80.84, rationale="Massive employment discrimination docket; banking whistleblower cases."),
    # 5th Circuit
    Node(city="Houston / El Paso, TX", circuit="5th", lat=29.76, lng=-95.37, rationale="Critical for immigration detention, border enforcement litigation, mass deportation challenges."),
    Node(city="New Orleans, LA",    circuit="5th", lat=29.95, lng=-90.07, rationale="Police misconduct and jail conditions; hurricane and insurance litigation."),
    Node(city="San Antonio, TX",    circuit="5th", lat=29.42, lng=-98.49, rationale="Immigration detention litigation; civil-rights suits against local agencies."),
    # 6th Circuit
    Node(city="Detroit, MI",        circuit="6th", lat=42.33, lng=-83.05, rationale="High poverty rates, significant municipal liability, heavily underserved plaintiff bar."),
    Node(city="Cleveland, OH",      circuit="6th", lat=41.50, lng=-81.69, rationale="Police reform consent decree legacy; strong §1983 litigation pipeline."),
    Node(city="Memphis, TN",        circuit="6th", lat=35.15, lng=-90.05, rationale="Police brutality cases; prisoner civil-rights litigation."),
    # 7th Circuit
    Node(city="Chicago, IL",        circuit="7th", lat=41.88, lng=-87.63, rationale="Core Midwest hub; exceptionally high §1983 and excessive force litigation volume."),
    Node(city="Milwaukee, WI",      circuit="7th", lat=43.04, lng=-87.91, rationale="High police litigation activity; prisoner rights claims."),
    Node(city="Indianapolis, IN",   circuit="7th", lat=39.77, lng=-86.16, rationale="Federal civil rights and employment discrimination."),
    # 8th Circuit
    Node(city="St. Louis, MO",      circuit="8th", lat=38.63, lng=-90.20, rationale="Protest-related litigation, jail condition claims, police force accountability."),
    Node(city="Minneapolis, MN",    circuit="8th", lat=44.98, lng=-93.27, rationale="Post-George Floyd police reform litigation; civil-rights impact cases."),
    Node(city="Kansas City, MO",    circuit="8th", lat=39.10, lng=-94.58, rationale="Police department controversies; employment and municipal liability cases."),
    # 9th Circuit
    Node(city="Sacramento / Stockton, CA", circuit="9th (Base)", lat=38.58, lng=-121.49, rationale="EDCA proximity, state agencies, high-density parole/probation populations. HOME BASE."),
    Node(city="San Francisco, CA",  circuit="9th", lat=37.77, lng=-122.42, rationale="N.D. Cal. — major civil rights and tech employment discrimination docket; progressive bench."),
    Node(city="Oakland, CA",        circuit="9th", lat=37.80, lng=-122.27, rationale="N.D. Cal. — deep police misconduct history; sustained civil rights litigation pipeline."),
    Node(city="San Jose, CA",       circuit="9th", lat=37.34, lng=-121.89, rationale="N.D. Cal. — tech-sector employment discrimination and wage theft cases."),
    Node(city="Fresno, CA",         circuit="9th", lat=36.74, lng=-119.79, rationale="E.D. Cal. — agricultural labor rights; farmworker civil rights and §1983 claims."),
    Node(city="Bakersfield, CA",    circuit="9th", lat=35.37, lng=-119.02, rationale="E.D. Cal. — agricultural and oil-industry workplace litigation; underserved plaintiff bar."),
    Node(city="San Bernardino, CA", circuit="9th", lat=34.11, lng=-117.29, rationale="C.D. Cal. — police misconduct and immigration enforcement litigation."),
    Node(city="Los Angeles, CA",    circuit="9th", lat=34.05, lng=-118.24, rationale="Largest civil-rights litigation ecosystem in America; massive police and jail litigation."),
    Node(city="Phoenix, AZ",        circuit="9th", lat=33.45, lng=-112.07, rationale="Immigration detention litigation; police misconduct cases."),
    # 10th Circuit
    Node(city="Denver / Albuquerque", circuit="10th", lat=39.74, lng=-104.99, rationale="Growing immigration hubs; Native American jurisdiction overlaps."),
    Node(city="Salt Lake City, UT", circuit="10th", lat=40.76, lng=-111.89, rationale="Police misconduct and religious employment disputes."),
    Node(city="Oklahoma City, OK",  circuit="10th", lat=35.47, lng=-97.52, rationale="Prisoner civil-rights and jail litigation."),
    # 11th Circuit
    Node(city="Atlanta / Miami",    circuit="11th", lat=33.75, lng=-84.39, rationale="Massive ICE detention footprint; heavy immigration and civil rights dockets."),
    Node(city="Orlando, FL",        circuit="11th", lat=28.54, lng=-81.38, rationale="Massive employment discrimination docket; theme-park employment litigation."),
    Node(city="Birmingham, AL",     circuit="11th", lat=33.52, lng=-86.81, rationale="Historic civil-rights litigation venue; police and prison cases."),
    # D.C. Circuit
    Node(city="Washington, D.C.",   circuit="D.C.", lat=38.91, lng=-77.04, rationale="Essential for APA/Mandamus against USCIS, DHS, DOJ headquarters."),
    Node(city="Silver Spring, MD",  circuit="D.C.", lat=38.99, lng=-77.03, rationale="Federal employee litigation hub near agency headquarters."),
]
