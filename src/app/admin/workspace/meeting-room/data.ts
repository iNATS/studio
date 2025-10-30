
export const emails = [
    {
      id: '1',
      name: 'Sarah Johnson',
      subject: 'Re: Project Update & Next Steps',
      text: "Thanks for the update! The latest designs look fantastic. I've left a few comments on the Figma file. Let's schedule a quick call for tomorrow to sync up. Best, Sarah",
      date: new Date(new Date().setDate(new Date().getDate() - 0)),
      read: false,
      avatar: 'https://picsum.photos/seed/sarah/100/100',
    },
    {
      id: '2',
      name: 'Michael Chen',
      subject: 'Question about the mobile app prototype',
      text: "Hey, had a quick question about the user flow for the funds transfer feature. Is it possible to add a confirmation step before the final submission? Let me know your thoughts. Thanks, Michael",
      date: new Date(new Date().setDate(new Date().getDate() - 1)),
      read: false,
      avatar: 'https://picsum.photos/seed/michael/100/100',
    },
    {
      id: '3',
      name: 'Emily Davis',
      subject: 'Inquiry: Full Branding Package',
      text: "Hi there, I found your portfolio and was very impressed. We're a new creative studio looking for a complete branding package. I'd love to learn more about your process and availability. Looking forward to hearing from you. Emily",
      date: new Date(new Date().setDate(new Date().getDate() - 2)),
      read: true,
      avatar: 'https://picsum.photos/seed/emily/100/100',
    },
    {
      id: '4',
      name: 'Jessica Lee',
      subject: 'Monthly Analytics Report for E-commerce Co.',
      text: "Hi, just a reminder that the monthly analytics report is due at the end of the week. Please let me know if you need anything from my end. Thanks! Jessica",
      date: new Date(new Date().setDate(new Date().getDate() - 4)),
      read: true,
      avatar: 'https://picsum.photos/seed/jessica/100/100',
    },
    {
      id: '5',
      name: 'Chris Brown',
      subject: 'Follow-up on Data Systems project',
      text: "Hello, following up on our conversation from last week. We're ready to move forward with the project. I've attached the signed proposal. Let me know what the next steps are. Regards, Chris",
      date: new Date(new Date().setDate(new Date().getDate() - 5)),
      read: true,
      avatar: 'https://picsum.photos/seed/chris/100/100',
    },
];

export const meetings = [
    {
        id: '1',
        title: 'Project Phoenix - Weekly Sync',
        time: new Date(new Date().setHours(10, 0, 0, 0)),
        duration: '30 min',
        participants: [
            { name: 'Sarah Johnson', avatar: 'https://picsum.photos/seed/sarah/100/100' },
            { name: 'You', avatar: 'https://yt3.googleusercontent.com/-ZvNMRTRJAdZN2n4mi8C32PvY_atHV3Zsrn1IAHthDnjxIGjwr9KTg9ww9mWS-5A-E3IPwbpSA=s900-c-k-c0x00ffffff-no-rj' }
        ]
    },
    {
        id: '2',
        title: 'Mobile App Prototype Review',
        time: new Date(new Date().setHours(14, 30, 0, 0)),
        duration: '1 hour',
        participants: [
            { name: 'Michael Chen', avatar: 'https://picsum.photos/seed/michael/100/100' },
            { name: 'You', avatar: 'https://yt3.googleusercontent.com/-ZvNMRTRJAdZN2n4mi8C32PvY_atHV3Zsrn1IAHthDnjxIGjwr9KTg9ww9mWS-5A-E3IPwbpSA=s900-c-k-c0x00ffffff-no-rj' }
        ]
    },
    {
        id: '3',
        title: 'New Branding Pitch',
        time: new Date(new Date(new Date().setDate(new Date().getDate() + 1)).setHours(11, 0, 0, 0)),
        duration: '45 min',
        participants: [
            { name: 'Emily Davis', avatar: 'https://picsum.photos/seed/emily/100/100' },
            { name: 'You', avatar: 'https://yt3.googleusercontent.com/-ZvNMRTRJAdZN2n4mi8C32PvY_atHV3Zsrn1IAHthDnjxIGjwr9KTg9ww9mWS-5A-E3IPwbpSA=s900-c-k-c0x00ffffff-no-rj' }
        ]
    }
];

export const contacts = [
    { id: '1', name: 'Sarah Johnson', email: 'sarah@innovate.com', avatar: 'https://picsum.photos/seed/sarah/100/100' },
    { id: '2', name: 'Michael Chen', email: 'm.chen@techsolutions.dev', avatar: 'https://picsum.photos/seed/michael/100/100' },
    { id: '3', name: 'Emily Davis', email: 'emily.d@quantumcreative.io', avatar: 'https://picsum.photos/seed/emily/100/100' },
    { id: '4', name: 'Jessica Lee', email: 'jess.lee@ecommerceco.com', avatar: 'https://picsum.photos/seed/jessica/100/100' },
    { id: '5', name: 'Chris Brown', email: 'chris.brown@datasystems.com', avatar: 'https://picsum.photos/seed/chris/100/100' },
    { id: '6', name: 'David Wilson', email: 'david.w@apex.digital', avatar: 'https://picsum.photos/seed/david/100/100' },
];

    