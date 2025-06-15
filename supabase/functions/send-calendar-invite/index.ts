
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface CalendarInviteRequest {
  eventTitle: string;
  eventDescription?: string;
  startTime: string;
  endTime: string;
  location?: string;
  attendees: string[];
  meetingType: string;
  organizer: string;
}

const generateICSFile = (event: CalendarInviteRequest) => {
  const startDate = new Date(event.startTime).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const endDate = new Date(event.endTime).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const now = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  
  return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Company Hub//EN
BEGIN:VEVENT
UID:${Date.now()}@company-hub.com
DTSTAMP:${now}
DTSTART:${startDate}
DTEND:${endDate}
SUMMARY:${event.eventTitle}
DESCRIPTION:${event.eventDescription || ''}
LOCATION:${event.location || ''}
ORGANIZER:CN=${event.organizer}:MAILTO:${event.organizer}
STATUS:CONFIRMED
SEQUENCE:0
END:VEVENT
END:VCALENDAR`;
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const eventData: CalendarInviteRequest = await req.json();

    const icsContent = generateICSFile(eventData);
    const icsBase64 = btoa(icsContent);

    for (const attendee of eventData.attendees) {
      const emailResponse = await resend.emails.send({
        from: "Company Hub <calendar@company-hub.com>",
        to: [attendee],
        subject: `Invitation: ${eventData.eventTitle}`,
        html: `
          <h2>You're invited to: ${eventData.eventTitle}</h2>
          ${eventData.eventDescription ? `<p><strong>Description:</strong> ${eventData.eventDescription}</p>` : ''}
          <p><strong>Date & Time:</strong> ${new Date(eventData.startTime).toLocaleString()} - ${new Date(eventData.endTime).toLocaleString()}</p>
          ${eventData.location ? `<p><strong>Location:</strong> ${eventData.location}</p>` : ''}
          <p><strong>Meeting Type:</strong> ${eventData.meetingType}</p>
          <p><strong>Organizer:</strong> ${eventData.organizer}</p>
          
          <p>This calendar event has been added to your calendar automatically if your email client supports it.</p>
        `,
        attachments: [
          {
            filename: `${eventData.eventTitle.replace(/[^a-zA-Z0-9]/g, '_')}.ics`,
            content: icsBase64,
            type: "text/calendar",
          },
        ],
      });

      console.log(`Invite sent to ${attendee}:`, emailResponse);
    }

    return new Response(
      JSON.stringify({ message: "Calendar invites sent successfully" }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error sending calendar invites:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
