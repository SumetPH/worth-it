# Spec: Manual Sort And Summary Toggle

## Assumptions
- This feature applies to the existing local-first Next.js app in this repository.
- "Sort เรียงด้วยตัวเอง" means adding a new sort mode that preserves a user-controlled item order.
- The up/down arrows live on each item card and only affect manual order.
- "Switch ปิด เปิด การคำนวนรวม" means each item can be included or excluded from the top summary metrics.
- Items excluded from summary still remain visible, editable, scored, sortable, backed up, and restored.
- No unit tests or browser tests will be added unless explicitly requested.

## Objective
Give users direct control over wishlist order and let them park items outside the aggregate budget summary without deleting them.

Success means a user can:
- Choose a manual sort mode from the existing sort dropdown.
- Move an item up or down from its item card.
- Toggle whether an item contributes to summary totals.
- Reload the page and keep both manual order and summary inclusion choices.
- Backup and restore data without losing the new fields.

## Tech Stack
- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- lucide-react for icons
- Browser `localStorage` for persistence

## Commands
- Install dependencies: `npm install`
- Dev server: `npm run dev`
- Lint: `npm run lint`
- Build: `npm run build`

## Project Structure
- `components/worth-it-app.tsx`: UI state, sort selector, item card actions, summary calculation.
- `lib/worth-it.ts`: `WishItem` type, default item shape, normalization, backup validation, sort behavior.
- `components/ui/*`: existing UI primitives. Use existing `Button`, `Select`, and label/input patterns.
- `specs/manual-sort-and-summary-toggle.md`: this feature spec.

## Data Model
Add two fields to `WishItem`:

```ts
type WishItem = {
  sortOrder: number;
  includeInSummary: boolean;
};
```

Defaults:
- New items get `sortOrder` that places them at the top of manual order, matching the current "new items first" behavior.
- Existing items and old backups are normalized with stable fallback `sortOrder` values based on current array order or creation time.
- Existing items and old backups default `includeInSummary` to `true`.

Backup/restore:
- Keep backup `version: 1` unless a broader migration policy is introduced.
- `isWishItem`, `normalizeWishItem`, and `normalizeBackupPayload` must accept both old data and new data safely.

## UI Behavior
### Manual Sort Mode
- Add a new `SortMode` value, `manual`.
- Add dropdown option label: `เรียงเอง`.
- `sortItems(items, profile, "manual")` sorts by `sortOrder` ascending, then by latest update/create time as a deterministic fallback.
- Moving items with arrows updates underlying `items`, not only the displayed array.

### Item Card Arrows
- Add two icon buttons to each `WishCard` using lucide icons such as `ArrowUp` and `ArrowDown`.
- Buttons appear beside the existing edit/delete actions.
- Up moves the item one position earlier in manual order.
- Down moves the item one position later in manual order.
- Disable up on the first manual item and disable down on the last manual item.
- If the current sort mode is not `manual`, clicking an arrow should switch to `manual` before/while applying the move so the user immediately sees the result.
- Buttons must have accessible labels, e.g. `เลื่อนขึ้น` and `เลื่อนลง`.

### Summary Toggle
- Add a switch-like control on each item card with label such as `รวมในยอดรวม`.
- Toggle updates `includeInSummary` for that item.
- When off, show a subdued state on the control; the card itself remains normal enough to inspect and edit.
- The summary metrics should calculate from included items only for:
  - `งบรวม`
  - `รายเดือนเพิ่ม`
  - `ซื้อได้แล้วจริง`
- `รายการทั้งหมด` should continue showing all visible items unless the implementation intentionally renames/splits the metric.

## Code Style
Follow the current style: typed React callbacks in `WorthItApp`, pure helpers in `lib/worth-it.ts`, and local UI primitives.

Example shape:

```ts
function moveItemInManualOrder(itemId: string, direction: "up" | "down") {
  setSortMode("manual");
  setItems((current) => reorderManualItems(current, itemId, direction));
}
```

```tsx
<Button type="button" variant="ghost" size="icon" onClick={onMoveUp} disabled={!canMoveUp} title="เลื่อนขึ้น">
  <ArrowUp className="size-4" />
  <span className="sr-only">เลื่อนขึ้น</span>
</Button>
```

## Verification Strategy
- Run `npm run lint`.
- Run `npm run build`.
- Manual acceptance check only if requested:
  - Add three items, switch to `เรียงเอง`, move middle item up/down.
  - Toggle one expensive item off and confirm summary cost/recurring/ready count excludes it.
  - Refresh page and confirm order/toggle state persists.
  - Backup and restore, then confirm order/toggle state persists.

## Boundaries
- Always:
  - Preserve old localStorage and old backup compatibility.
  - Keep scoring and recommendation formulas unchanged.
  - Keep item cards editable/deletable regardless of summary toggle.
  - Use existing UI primitives and lucide icons.
- Ask first:
  - Changing backup version.
  - Adding dependencies.
  - Renaming top-level metrics.
  - Adding drag-and-drop.
  - Making summary toggle affect scoring, readiness, or visibility.
- Never:
  - Git commit without explicit instruction.
  - Add unit tests or browser tests without explicit instruction.
  - Add CI/CD, Docker, telemetry, or large logging setup.
  - Remove existing sort modes.

## Success Criteria
- `SortMode` includes manual ordering and existing sort modes still work.
- Item card contains up/down controls with proper disabled states.
- Item card contains a summary inclusion switch.
- Summary excludes items with `includeInSummary: false` from cost, recurring cost, and ready count.
- New fields persist in localStorage and backup JSON.
- Old localStorage and old backups still load through normalization.
- `npm run lint` and `npm run build` pass after implementation.

## Open Questions
- Should `รายการทั้งหมด` count all items or only items included in summary? Current spec keeps it as all items.
- Should arrows be visible in every sort mode or only visible/active in manual mode? Current spec keeps them visible and switches to manual when used.
