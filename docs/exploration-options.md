# Dashboard iteration cues

Updated: 2026-11-23.

Use the visible cue in the floating Preview controls to name the target of an iteration. The cue remains visible on the collapsed Preview button and the selected option is encoded in its URL.

| Cue | Direction | Local entry |
| --- | --- | --- |
| **01 · Operations** | Existing NOC operator dashboard, WAN overview, and network work. | `/network-monitoring` |
| **02 · Governance** | Focused AI workforce supervision exploration. Formerly Workforce · Focused. | `/network-monitoring?exploration=workforce` |
| **03 · Combined — Live activity** | Detailed full-width overview; Attention and Actions in a two-column second row; full-width live Activity last. | `/network-monitoring?exploration=combined` |
| **03 · Combined — Baseline** | Preserved Combined layout before adding the network ribbon. | `/network-monitoring?exploration=combined&layout=baseline` |
| **Archive · Governance original** | Preserved first workforce exploration. Formerly Workforce · Original. | `/network-monitoring?exploration=workforce-original` |

## Working agreement

- Name the target in requests and progress updates, for example **“Iterate 03 · Combined — Live activity: simplify Attention.”**
- The current agreed iteration target is **03 · Combined — Live activity** until the user names another option. “This version” follows the explicitly selected/agreed cue; inspect the visible cue if context is uncertain.
- Keep other options intact. Apply a shared shell/component change across options only when that is part of the request or necessary for the shared component to work.
- Keep the numeric cues stable. Preserve existing URLs and archived references when changing descriptive labels.
- Put prototype scene/scenario controls outside the product UI. **Simulated** identifies the Combined fixture runner; no preview action calls a controller or changes real permissions.

## Combined implementation

The [use cases and interactions](operations-governance/USE-CASES-AND-INTERACTIONS.md) remain the design basis. Implementation lives in `src/features/combined/`; the shared option registry is `src/features/explorations/options.js`.

The [Network and live-work iteration](operations-governance/NETWORK-RIBBON.md) is the default Combined treatment. The previous Combined source is preserved independently in `src/features/combined-baseline/` and is selectable from the same floating menu. Both use cue 03 with an explicit layout name; they are alternatives within the same combined persona direction.

Combined opens with a classified Core/XR-R07 configuration incident and a bounded plan ready for review. Router reachability remains a separate observation. Review, authorization submission, effective authority, acknowledged execution, operation completion, and verified outcome remain distinct. The floating controls expose eight main snapshots and ten scenario branches. Play advances illustrative source events; it is not a production governor. The Activity pane reveals supporting snapshot facts automatically without issuing a decision or advancing job authority.

Hold and revision are interactive. A revised plan requires refreshed review and carries its exact version through later authority/action records. Inspection preserves work context. The three representative jobs retain separate evidence and results; the source-dependent investigation remains open when another job verifies.

This iteration does not add live services, a full job-inventory workspace, arbitrary graph exploration on Home, or unsupported in-flight cancellation. The existing Admin knowledge-graph explorer remains the broader context destination.
