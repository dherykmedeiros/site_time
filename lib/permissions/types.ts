export type Role = "ADMIN" | "PLAYER" | "COACH" | "MATERIAL_DIRECTOR";

export type Permission = 
  | "match:view" | "match:create" | "match:edit" | "match:delete"
  | "lineup:view" | "lineup:manage" | "lineup:publish"
  | "rsvp:view" | "rsvp:respond" | "rsvp:manage"
  | "player:view" | "player:create" | "player:edit" | "player:delete"
  | "finance:view" | "finance:manage"
  | "finance:view_own"
  | "equipment:view" | "equipment:manage"
  | "evaluation:view" | "evaluation:create" | "evaluation:view_own"
  | "fine:view" | "fine:create" | "fine:manage"
  | "rule:view" | "rule:manage"
  | "message:view" | "message:create" | "message:manage"
  | "poll:view" | "poll:vote" | "poll:create" | "poll:manage"
  | "gallery:view" | "gallery:upload" | "gallery:manage"
  | "season:view" | "season:manage"
  | "report:view" | "report:view_financial"
  | "team:view" | "team:manage"
  | "friendly_request:view" | "friendly_request:manage"
  | "recruitment:view" | "recruitment:manage"
  | "tactical:view" | "tactical:manage"
  | "notification:view" | "notification:manage";
