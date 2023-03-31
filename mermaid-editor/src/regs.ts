function isMermaidCode(text: string) {
  return (
    text.startsWith('flowchart TB') ||
    text.startsWith('flowchart TD') ||
    text.startsWith('flowchart BT') ||
    text.startsWith('flowchart RL') ||
    text.startsWith('flowchart LR') ||
    text.startsWith('classDiagram') ||
    text.startsWith('sequenceDiagram') ||
    text.startsWith('graph TD') ||
    text.startsWith('classDiagram') ||
    text.startsWith('stateDiagram-v2') ||
    text.startsWith('erDiagram') ||
    text.startsWith('gantt\n') ||
    text.startsWith('journey\n') ||
    text.startsWith('classDiagram') ||
    text.startsWith('gitGraph\n')
  );
}
export function isMermaid(res) {
  return isMermaidCode(res);
}
