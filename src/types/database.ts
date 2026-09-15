export type System = {
  id: string;
  name: string;
  color_code: string | null;
};

export type Ticket = {
  id: string;
  system_id: string;
  title: string;
  description: string | null;
  priority: 'urgent' | 'standard' | 'slow';
  status: 'pending' | 'in_progress' | 'done';
  voice_url: string | null;
  screenshot_url: string | null;
  reference_link: string | null;
  queue_order: number;
  created_at: string;
};