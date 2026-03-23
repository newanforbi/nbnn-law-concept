import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from models import DigitalChannel, CommunityItem, BrandItem

DIGITAL_CHANNELS = [
    DigitalChannel(channel="SEO Agency Retainer + Technical SEO", monthly="$15K–$25K", total_36mo="$540K–$900K"),
    DigitalChannel(channel="Content Production (manager + writers)", monthly="$8K–$12K", total_36mo="$288K–$432K"),
    DigitalChannel(channel="Google Ads (13 markets, tapered)", monthly="$15K–$50K (varies by phase)", total_36mo="$780K–$1.32M"),
    DigitalChannel(channel="Social Media Ads (FB/IG/YT/TikTok)", monthly="$8K–$15K", total_36mo="$288K–$540K"),
    DigitalChannel(channel="Video Production", monthly="$3K–$6K", total_36mo="$108K–$216K"),
    DigitalChannel(channel="TOTAL DIGITAL", monthly="", total_36mo="$2.00M–$3.41M", is_total=True),
]

COMMUNITY_ITEMS = [
    CommunityItem(
        label="Civil Rights Referral Network",
        bullet_items=["Local NAACP chapters and ACLU affiliates", "Public defender offices and community bail funds", "Police accountability organizations", "Local elected officials and community leaders", "Know-your-rights workshops (double as lead gen)"],
        accent="#E8927C",
    ),
    CommunityItem(
        label="Immigration Referral Network",
        bullet_items=["Immigrant advocacy organizations", "Churches with large immigrant congregations", "Ethnic community associations and consulates", "Legal aid orgs that can't take the volume", "Community fairs and cultural markets"],
        accent="#7EC8E3",
    ),
]

COMMUNITY_TABLE = [
    ["Community Engagement (13 nodes × $1.5K–$3K/mo)", "$19.5K–$39K", "$702K–$1.40M"],
    ["Free Consultation Infrastructure (virtual tools, interpreters, follow-up)", "$2K–$4K", "$72K–$144K"],
]

BRAND_ITEMS = [
    BrandItem(label="Billboards & Transit", desc="Billboard near Cook County jail. Bus ads in Brooklyn and the Bronx. Heavy rotation 3–4 months, then quarterly pulses. 5 tier-2 markets only.", cost="$150K–$350K/yr"),
    BrandItem(label="Spanish-Language Radio", desc="Houston, Miami, New York, Chicago, LA overflow. Pulsed campaigns targeting immigrant communities on trusted stations.", cost="$90K–$240K/yr"),
    BrandItem(label="Legal PR Retainer", desc="Every significant filing, settlement, or civil rights victory generates press. Legal PR firm places stories in local media and national outlets. The 'Guerrilla Litigation' brand is a story journalists want to tell.", cost="$72K–$144K/yr"),
]

BRAND_TABLE = [
    ["Billboards & Transit (5 tier-2 markets, pulsed)", "$150K–$350K", "$450K–$1.05M"],
    ["Spanish-Language & Community Radio", "$90K–$240K", "$270K–$720K"],
    ["Legal PR Firm Retainer", "$60K–$120K", "$180K–$360K"],
    ["Press Release Distribution & Media Monitoring", "$12K–$24K", "$36K–$72K"],
]

BUDGET_SUMMARY = [
    {"layer": "SEO & Content Production", "low": "$828K", "high": "$1.33M"},
    {"layer": "Paid Search (Google Ads)", "low": "$780K", "high": "$1.32M"},
    {"layer": "Social Media Ads + Video Production", "low": "$396K", "high": "$756K"},
    {"layer": "Community Engagement (13 nodes)", "low": "$702K", "high": "$1.40M"},
    {"layer": "Free Consultation Infrastructure", "low": "$72K", "high": "$144K"},
    {"layer": "Physical Advertising (billboards, transit, radio)", "low": "$720K", "high": "$1.77M"},
    {"layer": "PR & Earned Media", "low": "$216K", "high": "$432K"},
]

SPEND_PHASING = [
    ["Months 1–6 (Launch Blitz)", "~35%", "$290K–$320K/mo", "Google Ads maxed, SEO full speed, community overdrive, physical ads in rotation"],
    ["Months 7–18 (Sustained High)", "~40%", "$165K–$185K/mo", "Organic starting, paid search tapers where organic works, referral networks building"],
    ["Months 19–36 (Maintenance)", "~25%", "$70K–$80K/mo", "Organic is primary channel, paid fills gaps, community self-sustaining, physical is selective"],
]
