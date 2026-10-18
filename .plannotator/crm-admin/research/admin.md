# Admin console research (partial on Attio)
Observed: FF table.tsx (223 lines, plain <table> + one hover highlight; no sort, selection, keyboard nav, virtualization). FF command-menu has shortcut parsing, tabs, filters, sections. FF sidebar-core: provider, cookie persistence, resize, keyboard shortcut. FF has no kanban, rich text, PDF, date picker, data grid.
Observed: Twenty repo (packages/twenty-front/src/modules): activities/timeline-activities/rows/{calendar,generic,main-object,message}; object-record/record-board/record-board-dnd; record-table/virtualization; deps @dnd-kit/react, react-hotkeys-hook, @react-pdf/renderer (export only), tiptap, blocknote.
Attio help index page fetched: no content on record pages or timelines (inferred only).
