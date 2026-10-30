const { Tool } = require('@librechat/agents/langchain/tools');
const { execSync } = require('child_process');

class IntelTool extends Tool {
  static lc_name() {
    return 'intel';
  }

  constructor(fields = {}) {
    super(fields);
    this.name = 'intel';
    this.description =
      'Runs the local Intel Python script (/root/x/info.py) and returns its output, plus the paths to its generated files.';
    this.schema = {
      type: 'object',
      properties: {
        input: {
          type: 'string',
          description: 'Optional query string passed to the Intel script.',
        },
      },
    };
  }

  async _call(input = '') {
    const query = typeof input === 'string' ? input : input?.input ?? '';
    const safe = String(query).replace(/"/g, '\\"');
    try {
      const output = execSync(`python3 /root/x/info.py "${safe}"`, { stdio: 'pipe' });
      return (
        output.toString() +
        '\n\nGenerated files:\n- /root/x/live_conflict_map.png\n- /root/x/threat_intel_report.md'
      );
    } catch (error) {
      return `Intel error: ${error.stderr ? error.stderr.toString() : error.message}`;
    }
  }
}

module.exports = IntelTool;
