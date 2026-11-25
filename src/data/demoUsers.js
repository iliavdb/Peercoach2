export const demoPassword = 'peercoach'

export const demoAccounts = [
  {
    email: 'noor.bakker@student.zadkine.nl',
    name: 'Noor Bakker',
    role: 'student',
    details: [
      { label: 'Studentnummer', value: '2401842' },
      { label: 'Opleiding', value: 'Elektrotechniek · niveau 3' },
      { label: 'Klas', value: 'E2A · leerjaar 2' },
      { label: 'Peercoach', value: 'Yassin El Amrani' },
    ],
  },
  {
    email: 'marieke.dejong@tcrmbo.nl',
    name: 'Marieke de Jong',
    role: 'docent',
    details: [
      { label: 'Personeelsnummer', value: 'TCR-08421' },
      { label: 'Vakgebied', value: 'Elektrotechniek' },
      { label: 'Mentorklas', value: 'E2A · 18 studenten' },
      { label: 'Werkzaam als', value: 'Docent en mentor' },
    ],
  },
]

export const roleExamples = {
  student: {
    label: 'Student',
    schedule: [
      { time: '09:00', end: '10:30', title: 'Rekenen: vermogen en energie', detail: 'Lokaal B2.14 · Les', color: 'orange' },
      { time: '10:45', end: '12:15', title: 'Praktijk: groepenkast bedraden', detail: 'Werkplaats 1 · Klas E2A', color: 'blue' },
      { time: '13:00', end: '14:30', title: 'Nederlands: instructie schrijven', detail: 'Lokaal A1.08 · Les', color: 'green' },
      { time: '14:45', end: '15:30', title: 'Samen oefenen met Yassin', detail: 'Leerplein · Peercoach-moment', color: 'purple' },
    ],
    notifications: [
      { id: 1, title: 'Yassin heeft je oefenverzoek geaccepteerd', text: 'Jullie oefenen vandaag samen met het meten van spanning.', time: 'Vandaag · 08:42', unread: true, icon: '✳' },
      { id: 2, title: 'Praktijklokaal bevestigd', text: 'Je les groepenkast bedraden is in Werkplaats 1.', time: 'Gisteren · 15:10', unread: true, icon: '▦' },
      { id: 3, title: 'Feedback op je reflectie', text: 'Je docent heeft een tip achtergelaten bij je weekreflectie.', time: 'Maandag · 09:00', unread: false, icon: '↗' },
    ],
    settings: [
      { id: 'rooster', title: 'Roosterwijzigingen', description: 'Ontvang een melding als een les of lokaal verandert.', enabled: true },
      { id: 'coach', title: 'Peercoach-afspraken', description: 'Ontvang updates over oefenverzoeken en afspraken.', enabled: true },
      { id: 'feedback', title: 'Feedback op opdrachten', description: 'Weet wanneer je docent feedback heeft geplaatst.', enabled: false },
    ],
    highlight: {
      title: 'Jouw peercoach-traject',
      text: 'Je hebt deze periode 3 van de 4 oefenmomenten afgerond. Vandaag werk je met Yassin aan veilig meten.',
    },
    actions: {
      eyebrow: 'SAMEN LEREN',
      title: 'Jouw peercoach-afspraak',
      description: 'Maak je oefenmoment concreet en vink af wanneer je klaar bent om samen te oefenen.',
      items: [
        {
          id: 'peercoach-session',
          title: 'Oefenmoment met Yassin',
          detail: 'Vandaag · 14:45 · Leerplein · veilig spanning meten',
          actionLabel: 'Markeer als voorbereid',
          completedLabel: 'Voorbereid',
        },
      ],
    },
  },
  docent: {
    label: 'Docent',
    schedule: [
      { time: '08:30', end: '10:00', title: 'Praktijk elektrotechniek', detail: 'Werkplaats 1 · Klas E2A', color: 'orange' },
      { time: '10:15', end: '11:00', title: 'Mentorgesprek: Samira', detail: 'Kamer 2.06 · Individuele begeleiding', color: 'blue' },
      { time: '11:15', end: '12:00', title: 'Voortgang bespreken', detail: 'Lokaal B2.14 · Klas E2A', color: 'green' },
      { time: '13:00', end: '14:00', title: 'Peercoach-koppelingen', detail: 'Leerplein · Studentbegeleiding', color: 'purple' },
    ],
    notifications: [
      { id: 1, title: 'Actie gevraagd: voortgang Samira', text: 'De praktijkreflectie van deze week is nog niet ingeleverd.', time: 'Vandaag · 08:05', unread: true, icon: '!' },
      { id: 2, title: 'Peercoach-koppeling bevestigd', text: 'Noor Bakker en Yassin El Amrani hebben hun oefenmoment ingepland.', time: 'Gisteren · 16:20', unread: true, icon: '✳' },
      { id: 3, title: 'Teamoverleg verplaatst', text: 'Het overleg elektrotechniek start donderdag om 15:15 in kamer 2.06.', time: 'Dinsdag · 11:30', unread: false, icon: '▦' },
    ],
    settings: [
      { id: 'student', title: 'Studentvoortgang', description: 'Ontvang een melding bij nieuwe reflecties en achterstanden.', enabled: true },
      { id: 'coach', title: 'Peercoach-koppelingen', description: 'Ontvang updates over verzoeken en geplande oefenmomenten.', enabled: true },
      { id: 'team', title: 'Team- en roosterupdates', description: 'Blijf op de hoogte van wijzigingen voor je lessen en team.', enabled: false },
    ],
    highlight: {
      title: 'Mentorgroep E2A',
      text: 'Je begeleidt 18 studenten. Vandaag staan een individueel mentorgesprek en de opvolging van 2 reflecties op je planning.',
    },
    actions: {
      eyebrow: 'MENTORGROEP E2A',
      title: 'Studentopvolging',
      description: 'Werk openstaande begeleiding bij zodat je overzicht houdt over je mentorgroep.',
      items: [
        {
          id: 'samira-reflection',
          title: 'Samira Akbari',
          detail: 'Praktijkreflectie ontbreekt · opvolgen voor vrijdag',
          actionLabel: 'Markeer als opgevolgd',
          completedLabel: 'Opgevolgd',
        },
        {
          id: 'dylan-absence',
          title: 'Dylan Visser',
          detail: 'Mentorgesprek plannen over aanwezigheid · klas E2A',
          actionLabel: 'Markeer als opgevolgd',
          completedLabel: 'Opgevolgd',
        },
      ],
    },
  },
}
