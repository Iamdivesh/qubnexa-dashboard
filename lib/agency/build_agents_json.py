#!/usr/bin/env python3
"""
Build agency-agents.json from the msitarzewski/agency-agents repo.
Scans all .md files, extracts YAML frontmatter, maps to our dashboard's
department structure, and writes a flat JSON index.
"""

import json
import os
import re
import sys
from pathlib import Path
from typing import Any

HERMES_HOME = os.environ.get("HERMES_HOME", "").replace("/", "\\")
if HERMES_HOME:
    # D:\QubNexa\hermes -> go up to D:\ then into Obsidian Vault
    base = Path(HERMES_HOME).drive + "\\"
    AGENTS_REPO = Path(base) / "Obsidian Vault" / "Projects" / "QubNexa" / "agency-agents"
    OUTPUT = Path(base) / "Obsidian Vault" / "Projects" / "QubNexa" / "agency-agents.json"
else:
    AGENTS_REPO = Path("D:/Obsidian Vault/Projects/QubNexa/agency-agents")
    OUTPUT = Path("D:/Obsidian Vault/Projects/QubNexa/agency-agents.json")

# The divisions.json from the repo is the source of truth
DIVISIONS_JSON = AGENTS_REPO / "divisions.json"

# Map repo divisions to our dashboard departments
# Our dashboard has: sales, outreach, marketing, finance, product, operations, development
DIVISION_TO_DEPT: dict[str, str] = {
    "sales": "sales",
    "outreach": "outreach",
    "marketing": "marketing",
    "finance": "finance",
    "product": "product",
    "operations": "operations",
    "development": "development",
    # Repo divisions that map to our 7-department system
    "engineering": "development",
    "design": "marketing",
    "research": "product",
    "game-development": "product",
    "academic": "product",
    "healthcare": "sales",
    "gis": "operations",
    "paid-media": "marketing",
    "project-management": "operations",
    "integrations": "operations",
    # Unmapped repo divisions — fold into closest department
    ".github": "development",
    "security": "development",
    "spatial-computing": "product",
    "specialized": "sales",
    "support": "operations",
    "testing": "development",
}

# Our dashboard department system — must match DepartmentAgents.tsx DEPT_FILTERS and agents page DEPARTMENTS
# The agents page defines: sales, outreach, marketing, finance, product, operations, development
# DepartmentAgents (sidebar) filters by filename keywords
# agents page (central hub) uses division field to group

# Map repo divisions to our 7-department system
# We'll use the division field from the agent's frontmatter (which comes from divisions.json)
# and map it to our department names

OUR_DEPT_NAMES = {
    "sales": "Sales & Pipeline",
    "outreach": "Outreach & CRM",
    "marketing": "Marketing & Content",
    "finance": "Finance & MRR",
    "product": "Product Research",
    "operations": "Operations & Delivery",
    "development": "Development",
}

OUR_DEPT_COLORS = {
    "sales": "#2F6FED",
    "outreach": "#E4DAC6",
    "marketing": "#059669",
    "finance": "#1e54c7",
    "product": "#7C3AED",
    "operations": "#0B1E3D",
    "development": "#D97706",
}

OUR_DEPT_ICONS = {
    "sales": "🎯",
    "outreach": "💌",
    "marketing": "📢",
    "finance": "💰",
    "product": "💡",
    "operations": "⚙️",
    "development": "💻",
}


def parse_frontmatter(content: str) -> tuple[dict[str, Any], str]:
    """Extract YAML frontmatter and body from markdown."""
    if not content.startswith("---"):
        return {}, content

    parts = content.split("---", 2)
    if len(parts) < 3:
        return {}, content

    fm_block = parts[1].strip()
    body = parts[2].strip()

    fm: dict[str, Any] = {}
    for line in fm_block.splitlines():
        m = re.match(r'^(\w+):\s*(.+)$', line)
        if m:
            key, val = m.group(1), m.group(2).strip()
            # Try to parse as JSON/list
            try:
                val = json.loads(val)
            except json.JSONDecodeError:
                pass
            fm[key] = val

    return fm, body


def load_divisions() -> dict[str, dict]:
    """Load divisions.json from the repo."""
    if not DIVISIONS_JSON.exists():
        print(f"WARNING: {DIVISIONS_JSON} not found")
        return {}

    with open(DIVISIONS_JSON) as f:
        data = json.load(f)

    return data.get("divisions", {})


def scan_agents() -> list[dict]:
    """Scan all .md files in the repo and extract agent info."""
    agents = []
    seen = set()

    divisions = load_divisions()
    print(f"Loaded {len(divisions)} divisions from divisions.json")

    # Find all .md files in division directories (skip integrations/, examples/, scripts/, strategy/)
    skip_dirs = {"integrations", "examples", "scripts", "strategy"}

    for md_file in AGENTS_REPO.rglob("*.md"):
        # Skip root-level non-agent files
        if md_file.parent == AGENTS_REPO:
            continue
        # Skip non-division directories
        rel = md_file.relative_to(AGENTS_REPO)
        if rel.parts[0] in skip_dirs:
            continue

        division = rel.parts[0]

        try:
            content = md_file.read_text(encoding="utf-8", errors="ignore")
        except Exception as e:
            print(f"  ERROR reading {md_file}: {e}")
            continue

        fm, body = parse_frontmatter(content)

        # Agent name: from frontmatter 'name' or filename
        name = fm.get("name", "")
        if not name:
            name = md_file.stem.replace("-", " ").replace("_", " ").title()

        agent_id = fm.get("id", md_file.stem)

        if agent_id in seen:
            continue
        seen.add(agent_id)

        # Description: first non-empty paragraph of body
        description = ""
        for para in body.split("\n\n"):
            para = para.strip()
            if para and not para.startswith("#"):
                description = para[:200]
                break

        # Vibe / emoji from frontmatter
        vibe = fm.get("vibe", fm.get("persona", ""))
        emoji = fm.get("emoji", "")

        # Filename
        filename = md_file.relative_to(AGENTS_REPO).as_posix()

        # Map division to our department
        dept = DIVISION_TO_DEPT.get(division, division)

        # Reclassify some sales agents as outreach (our dashboard has a separate Outreach dept)
        outreach_keywords = ["outbound", "linkedin", "outreach", "email-strategist", "sales-outreach", "email"]
        if dept == "sales" and any(kw in filename.lower() for kw in outreach_keywords):
            dept = "outreach"

        # Division color/icon from divisions.json (repo's own)
        div_info = divisions.get(division, {})
        repo_color = div_info.get("color", "#6B7280")
        repo_icon = div_info.get("icon", "FileText")
        repo_label = div_info.get("label", division.title())

        agents.append({
            "id": agent_id,
            "name": name,
            "filename": filename,
            "division": division,
            "division_label": repo_label,
            "division_color": repo_color,
            "division_icon": repo_icon,
            "department": dept,
            "department_name": OUR_DEPT_NAMES.get(dept, dept.title()),
            "department_color": OUR_DEPT_COLORS.get(dept, "#6B7280"),
            "department_icon": OUR_DEPT_ICONS.get(dept, "📁"),
            "description": description,
            "vibe": str(vibe)[:100] if vibe else "",
            "emoji": emoji,
            "filepath": str(md_file),
            "sections": extract_sections(body),
        })

    return agents


def extract_sections(body: str) -> list[str]:
    """Extract H2/H3 headings as section names."""
    sections = []
    for line in body.splitlines():
        line = line.strip()
        if line.startswith("## ") and not line.startswith("### "):
            sections.append(line[3:].strip())
        elif line.startswith("### "):
            sections.append(line[4:].strip())
    return sections[:10]  # Top 10 sections


def main():
    print(f"Scanning {AGENTS_REPO}...")
    agents = scan_agents()
    print(f"Found {len(agents)} agents")

    # Sort by division then name
    agents.sort(key=lambda a: (a["division"], a["name"]))

    # Count per department
    dept_counts: dict[str, int] = {}
    for a in agents:
        d = a["department"]
        dept_counts[d] = dept_counts.get(d, 0) + 1

    print("\nPer department:")
    for dept in sorted(dept_counts):
        print(f"  {dept}: {dept_counts[dept]}")

    # Write output
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    with open(OUTPUT, "w", encoding="utf-8") as f:
        json.dump(agents, f, indent=2, ensure_ascii=False)

    size_kb = OUTPUT.stat().st_size / 1024
    print(f"\nWrote {OUTPUT} ({size_kb:.1f} KB)")


if __name__ == "__main__":
    main()
