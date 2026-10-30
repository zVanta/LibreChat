const { Tool } = require('@librechat/agents/langchain/tools');
const { execSync } = require('child_process');

class ThreatIntelTool extends Tool {
  static lc_name() {
    return 'threat_intel';
  }

  constructor(fields = {}) {
    super(fields);
    this.name = 'threat_intel';
    this.description =
      'Runs the local threat-intel Python feed and returns its report text, plus the paths to its generated map and report files.';
    this.schema = {
      type: 'object',
      properties: {
        input: {
          type: 'string',
          description: 'Optional query string passed to the threat intel script.',
        },
      },
    };
  }

  async _call(input = '') {
    const query = typeof input === 'string' ? input : input?.input ?? '';
    const safe = String(query).replace(/"/g, '\\"');
    try {
      const output = execSync(`python3 /root/threat-intel/threat_intel_feed.py "${safe}"`, {
        stdio: 'pipe',
      });
      return (
        output.toString() +
        '\n\nGenerated files:\n- /root/threat-intel/live_conflict_map.png\n- /root/threat-intel/threat_intel_report.md'
      );
    } catch (error) {
      return `ThreatIntel error: ${error.stderr ? error.stderr.toString() : error.message}`;
    }
  }
}

module.exports = ThreatIntelTool;
