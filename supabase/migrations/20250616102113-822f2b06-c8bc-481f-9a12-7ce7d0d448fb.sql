
-- Update the task "fdfdf" to be a child of the milestone
UPDATE gantt_items 
SET parent_id = '5c2ad1af-fc1d-4189-88f2-ab825f22d3bd'
WHERE title = 'fdfdf' AND type = 'task';

-- Insert a couple of subtasks under the task to show the full hierarchy
INSERT INTO gantt_items (title, type, parent_id, assignee, priority, status, start_date, end_date, progress, description)
VALUES 
(
  'Subtask 1: Research Phase', 
  'subtask', 
  (SELECT id FROM gantt_items WHERE title = 'fdfdf' AND type = 'task' LIMIT 1),
  'John Smith',
  'High',
  'In Progress',
  '2024-12-17',
  '2024-12-20',
  30,
  'Initial research and analysis'
),
(
  'Subtask 2: Implementation', 
  'subtask', 
  (SELECT id FROM gantt_items WHERE title = 'fdfdf' AND type = 'task' LIMIT 1),
  'Sarah Johnson',
  'Medium',
  'Not Started',
  '2024-12-21',
  '2024-12-25',
  0,
  'Core implementation work'
);
