# CRM patterns: person actions, composer, tasks, deals board

Status: partial. Observed = read from source or official page. Inferred = my recommendation.

## Sources actually read
- Twenty (github.com/twentyhq/twenty, main): packages/twenty-front/src/modules/activities/tasks/components/{TaskGroups,TaskGroupsContent,TaskRow}.tsx, activities/types/Task.ts, object-record/record-board/record-board-card/components/RecordBoardCard.tsx, command-menu-item/components/RecordShowCommandMenu.tsx (listed, not read).
- HubSpot: knowledge.hubspot.com/tasks/create-tasks, /tasks/task-reminders-and-daily-digest, search summaries of /tasks/filter-tasks-and-manage-task-views, /records/manage-records-in-board-view, /object-settings/select-properties-to-show-on-records-in-board-view, /records/work-with-records.
- Attio: attio.com/help/reference/productivity-collaborating/tasks.
- Linear: search summary of linear.app/docs/my-issues and /docs/due-dates.

## 1. Person record actions
Observed: HubSpot keeps the actions inside the timeline column as tabs (Notes, Emails, then a "More" menu with Calls, Tasks, Meetings) plus a Task action in the left panel. Twenty puts record actions in a command menu (RecordShowCommandMenu, RecordPageSidePanelPinnedCommandMenuItems: a few pinned, rest in a menu). Attio opens the task window from `t` anywhere or Cmd/Ctrl+K quick actions.
Recommend (inferred): one primary button, "Write to them", plus one split/segmented composer (see 2). Everything else moves: "Open a deal" and "Add a task" live in the composer/Deals panel, "Give portal access" goes in the portal panel of the right column, "Edit details" is an inline pencil on the About panel. Add a "..." menu for rare actions. Shortcuts: `e` email, `n` note, `c` call, `t` task, Cmd+K for all.
Reject: seven equal buttons in a row.

## 2. Activity composer
Observed: HubSpot has one composer area with tabs Note / Email / Call / Meeting / Task over a single timeline; "Log activity" or "Save note" posts it to the timeline; logging a call or email offers a "Create a To-do" checkbox for a follow-up with due date options (create-tasks article). Timeline has filters and a "Search activities" box over email subject, task, note and call bodies.
Recommend (inferred): a composer card at the top of the timeline with tabs Email | Note | Call | Task, last used tab remembered, Email default. Call tab: outcome select (Connected, No answer, Left message, Wrong number), duration, note, and a "Follow-up task" row prefilled "Tomorrow 10:00". Note tab can attach to an enquiry or deal. Timeline below, filter chips (All, Emails, Calls, Notes, Tasks), email rows show Delivered/Opened badges.
Reject: separate dialogs per activity type.

## 3. Tasks
Observed:
- Twenty groups by status, not date: TaskGroupsContent does `groupBy(tasks, status)` and sorts group keys; Task type has `assignee`, `status: TODO|IN_PROGRESS|DONE`, `dueAt`; row = round checkbox, title, body excerpt, linked targets, due date red when past (TaskRow StyledDueDate isPast). Empty state "Mission accomplished!" with a New task button. This is the "stupid list" shape; reject it.
- Attio: creation by `t` anywhere, Cmd+K "Create task", or + on Home. Inline syntax: "Type @ followed by a record name to tie the task to a record", "@ followed by a member's name to assign". Natural language dates: "call Tuesday at 7pm", "follow up next week", "check-in in September". Home shows assigned tasks "due today, due tomorrow, or overdue". Tasks page groups by Due Date, Assignee, Created Date, Created by; filter by assignee; toggle to show completed. Notifications for assignment plus a daily reminder of tasks due. API fields: content, deadline_at, is_completed, linked_records, assignees.
- HubSpot: fields Title, Type (Call, Email, To-do), Priority, Associations, Assigned to, Queue, Due date and time, Reminder, Notes. Title containing "call" or "email" sets the type. Create and add another. Bulk "Create tasks" for selected records. Views: Due today, Overdue, Upcoming (assigned and uncompleted). Default due offset, default due time and default reminder are user preferences. Reminder options: "At task due time", "1 hour before", Custom, No reminder; email only to the owner. Daily digest: prepared 6 AM, sent 8 AM weekdays, not sent if nothing due, shows due-today count by type and three tasks with a "View all due today" link. Unassociated tasks do not appear on record timelines. Recurring tasks respawn on complete, delete or overdue. Follow-up task prompted when finishing a task.
- Linear: My issues has tabs Assigned, Created, Subscribed, Activity; assigned issues grouped by focus order (urgent, SLA, blockers, cycle, active, triage, backlog, completed). Due date: Shift+D on an issue, Cmd+Shift+D removes. Natural language in Linear is only claimed by a third-party blog, so unverified.

Recommend (inferred) for Moneybee:
- Page /admin/tasks "My day": groups Overdue (red, count), Today, Tomorrow, This week, Later, No date; Done collapsed with toggle "Show done". Tabs: Mine | Team | Created by me. Filters: person, type, assignee.
- Row: round checkbox, title, type icon (Call/Email/To-do/Follow playbook step), linked person chip, linked enquiry/deal chip, due label ("Today 4:30 pm", red when past), assignee avatar. Row hover: snooze, reassign.
- Create: global `t` and Cmd+K; single-line input that parses "Call Rakesh tomorrow 10am @Rakesh Shah"; @ picks person/enquiry/deal, assignee via a second chip. Due picker presets: Today 5 pm, Tomorrow 10 am, Monday 10 am, Next week, Custom; default Tomorrow 10 am. "Create and add another".
- From playbook steps: each step with a reply deadline auto-creates a task (due = deadline, linked to enquiry and person, type from step). From a call outcome: after Log call, the follow-up row is prefilled by outcome (No answer: tomorrow 10 am; Connected: +3 days; Wrong number: none).
- Assignment: default creator, or owner of the person; `@` assigns.
- Reminders: in-app badge on nav for overdue+today, email at due time or 1 hour before (default), plus weekday 8 am digest to each assignee, skipped when empty (HubSpot model).
- Completion: checkbox opens a small inline "Outcome" field (optional note) and a "Next task" quick row; completion posts to the person's timeline as "Task done: title, note, by whom". Undo toast.
- Linking: required link to a person or enquiry (HubSpot shows unassociated tasks nowhere on timelines); deal optional.
Reject: status-grouped list (Twenty), checkbox with no due date or link, tasks invisible on the person timeline.

## 4. Deals pipeline board
Observed: HubSpot board: drag a card between stages; if the stage has required properties a prompt asks for them before the move; column header shows count plus total and weighted amount; weighted = total x stage probability (defaults 20/40/60/80/90/100/0); card click opens a right panel, name click opens full record; card order is configurable (e.g. Amount high to low); card properties are configurable and reorderable. Twenty RecordBoardCard: drag overlay, multi-drag stack, selection, compact mode, right-click context menu, click opens record.
Recommend (inferred): columns Enquiry, Contacted, Meeting, Documents sent, Onboarding, Invested, Lost. Header: stage name, count, total commitment (INR, lakh/crore format). Card: person name, entity, product (PMS/AIF), amount, owner avatar, days in stage, next task due (red if overdue). Drag to Lost requires a reason; drag to Invested asks amount and date; drag to Documents sent can offer to create the "chase documents" task. Click card opens right panel with the composer; full page via name. Also keep a table/list toggle. Weighted amount optional: skip until probabilities are agreed.
Reject: no-prompt drags to Lost, cards showing only a name.

## Access gaps
- Twenty record-show page layout and RecordShowCommandMenu not read; no task creation component read (createActivity opens a side-panel record).
- HubSpot "complete tasks" article and the exact due-date preset list not read (create-tasks says options exist but does not list them). Board/timeline pages seen only via search summaries.
- Attio did not state how completion works or list task detail fields; Attio board/list docs not read.
- Linear natural language dates unconfirmed from official docs; quick create shortcut `c` unconfirmed.
- Pinning on HubSpot timeline disputed by third-party sources.
