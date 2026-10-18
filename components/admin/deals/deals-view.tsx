import type { AdminViewServerProps } from "payload";
import { AdminView } from "@/components/admin/admin-view";
import { CRM_ROLES, hasRole } from "@/lib/backend/roles";
import { dealBoard, type DealKind } from "@/lib/crm/deal-board";
import { DealsScreen } from "./deals-screen";

/**
 * /admin/deals (payload.config.ts admin.components.views.deals): every deal
 * of one product kind, on a board by stage or as a list. ?kind= picks PMS or
 * Flyingbee AIF, ?view=list the list, ?owner=<user id> one person's deals;
 * all three stay in the address, so Back from a person returns here as it was.
 */
export async function DealsView(props: AdminViewServerProps) {
  const { req } = props.initPageResult;
  const user = req.user?.collection === "users" && hasRole(req.user, ...CRM_ROLES) ? req.user : null;
  const params = props.searchParams ?? {};
  const kind: DealKind = params.kind === "aif" ? "aif" : "pms";
  const view = params.view === "list" ? "list" : "board";
  const owner = Number(typeof params.owner === "string" ? params.owner : NaN);
  const board = user ? await dealBoard(req.payload, user, { kind, owner: Number.isInteger(owner) ? owner : null }) : null;
  return <AdminView {...props} roles={CRM_ROLES}>{() => (board ? <DealsScreen board={board} view={view} /> : null)}</AdminView>;
}
