import { DialogueScene } from '../core/models/dialogue.model';

/**
 * Zentrales Register aller Dialog-Szenen, referenziert per ID
 * aus HexTile.event.dialogueSceneId bzw. interactable.dialogueSceneId.
 */
export const DIALOGUE_SCENES: Record<string, DialogueScene> = {
  intro: {
    id: 'intro',
    trigger: 'intro',
    once: true,
    hasPlayed: false,
    lines: [
      {
        speaker: 'narrator',
        text:
          "Ein Krachen. Ein Splittern. Ein sehr unwürdiges \"Oooomph\". Die Königliche Barke „Wappen von Herford“ ist Geschichte.",
      },
      {
        speaker: 'princess',
        emotion: 'annoyed',
        text: 'Helix. HELIX. Würden Sie mir freundlicherweise erklären, warum ich gerade mit dem Gesicht in einem Sandhügel liege?',
      },
      {
        speaker: 'helix',
        emotion: 'smug',
        text: 'Weil das Schicksal große Abenteurer eben genau so empfängt, Eure Durchlaucht. Mit einem gewissen dramatischen Timing.',
      },
      {
        speaker: 'princess',
        emotion: 'sarcastic',
        text: 'Das Schicksal hätte auch einfach freundlich winken können.',
      },
      {
        speaker: 'helix',
        emotion: 'confused',
        text: 'Das war eine taktische Abkürzung. Durch die "Klippen der Ewigen Ruhe". Sehr berühmt, in gewissen Kreisen.',
      },
      {
        speaker: 'princess',
        emotion: 'annoyed',
        text: 'Berühmt dafür, dass dort regelmäßig Schiffe verschwinden, ja.',
      },
      {
        speaker: 'helix',
        emotion: 'panicked',
        text: 'Auf der Karte stand ein Ausrufezeichen! Das bedeutet doch eindeutig "hier lang, es lohnt sich"!',
      },
      {
        speaker: 'princess',
        emotion: 'sarcastic',
        text: 'Es bedeutet "Vorsicht", Helix. Man kann ein ganzes Königreich daran erkennen, wer diesen Unterschied nicht kennt.',
      },
      {
        speaker: 'narrator',
        text: 'Von den Piraten, die den Königsschatz gestohlen hatten, fehlt inzwischen jede Spur – ebenso wie von der restlichen Besatzung, die sich beim ersten Donnerschlag klugerweise mit dem Rettungsboot davonmachte.',
      },
      {
        speaker: 'helix',
        emotion: 'smug',
        text: 'Kluge Männer, diese Männer. Ich hätte es ihnen fast gleichgetan, wäre da nicht meine sprichwörtliche Tapferkeit gewesen.',
      },
      {
        speaker: 'princess',
        emotion: 'annoyed',
        text: 'Ihre "sprichwörtliche Tapferkeit" saß die ganze Zeit neben mir und hat gezittert.',
      },
      {
        speaker: 'narrator',
        text: 'Zurück bleiben: eine Prinzessin auf Schatzsuche – und ein Mann, der sich selbst für eine Legende hält, obwohl bisher niemand sonst davon gehört hat.',
      },
      {
        speaker: 'helix',
        emotion: 'confused',
        text: 'Ich bin durchaus eine Legende. In bestimmten Hafenstädten. Unter bestimmten Umständen. Meistens, wenn gerade eine Belohnung auf mich ausgesetzt war.',
      },
      {
        speaker: 'princess',
        emotion: 'sarcastic',
        text: 'Legende, oder war das die Alternative zu ein paar Jahren im Kerker Seiner Majestät?',
      },
      {
        speaker: 'helix',
        emotion: 'panicked',
        text: 'Das war eine beiderseitige, äußerst faire Vereinbarung!',
      },
      {
        speaker: 'princess',
        emotion: 'sarcastic',
        text: 'War das Teil Ihrer heldenhaften Selbstauskunft?',
      },
      {
        speaker: 'helix',
        emotion: 'smug',
        text: 'Das nennt man dramatische Vorgeschichte. Jeder große Abenteurer hat eine.',
      },
      {
        speaker: 'princess',
        emotion: 'sarcastic',
        text: 'Interessant. Bei Ihnen besteht die Vorgeschichte bisher ausschließlich aus Schiffbrüchen.',
      },
      {
        speaker: 'narrator',
        text: 'Der Königsschatz ist verschollen, die Piraten sind irgendwo da draußen, und die einzige Spur führt genau hierher: auf diese Insel.',
      },
      {
        speaker: 'helix',
        emotion: 'panicked',
        text: 'Also gut. Was schlagen Sie vor, Eure Durchlaucht?',
      },
      {
        speaker: 'princess',
        emotion: 'neutral',
        text: 'Zuerst: Dieser Sand ist eine Zumutung für jeden anständigen Stoff. Zweitens: Die Strömung kam aus Nordost, wir sind vermutlich südlich der Hauptroute gestrandet. Wir erkunden.',
      },
      {
        speaker: 'helix',
        emotion: 'confused',
        text: 'Woher wissen Sie das bitte?',
      },
      {
        speaker: 'princess',
        emotion: 'smug',
        text: 'Man lernt einiges, wenn man nicht nur auf Kissen sitzt, Helix.',
      },
      {
        speaker: 'narrator',
        text: 'Widerwillig rappeln sich beide auf. Vor ihnen liegt eine Insel voller Nebel, Geheimnisse – und irgendwo darauf, wenn das Glück will, eine Spur zum gestohlenen Schatz.',
      },
    ],
  },

  'rustling-creature-intro': {
    id: 'rustling-creature-intro',
    trigger: 'manual',
    once: true,
    hasPlayed: false,
    lines: [
      {
        speaker: 'narrator',
        text: 'Das Rascheln im Gebüsch wird lauter. Näher. Etwas bewegt sich, gut versteckt zwischen den Blättern.',
      },
      {
        speaker: 'helix',
        emotion: 'panicked',
        text: 'ALLE MANN AUF POSITION! BACKBORD HALTEN! AUGEN AUF DEN STEUERMANN!',
      },
      {
        speaker: 'princess',
        emotion: 'sarcastic',
        text: 'Wir haben keine Mannschaft, kein Schiff, und – soweit ich weiß – auch keinen Steuermann. Sie brüllen Befehle ins Leere.',
      },
      {
        speaker: 'helix',
        emotion: 'confused',
        text: 'Es beruhigt mich trotzdem. Alte Gewohnheit.',
      },
      {
        speaker: 'narrator',
        text: 'Das Rascheln kommt jetzt aus einem einzelnen Busch, keine drei Schritte entfernt. Beide halten inne.',
      },
    ],
  },

  'rustling-creature-diplomacy-outcome': {
    id: 'rustling-creature-diplomacy-outcome',
    trigger: 'manual',
    once: true,
    hasPlayed: false,
    lines: [
      {
        speaker: 'narrator',
        text: 'Laja hält den Blick reglos auf das Gebüsch gerichtet, ignoriert jedes Zittern und jeden Windstoß. Nach einigen angespannten Sekunden lohnt sich die Geduld.',
      },
      {
        speaker: 'princess',
        emotion: 'smug',
        text: 'Helix, es ist nur ein Kaninchen. Beruhigen Sie sich.',
      },
      {
        speaker: 'narrator',
        text: 'Ein kleines, äußerst entspanntes Kaninchen schiebt sich aus dem Gebüsch, mustert die beiden mit mäßigem Interesse und hoppelt gemächlich davon.',
      },
      {
        speaker: 'helix',
        emotion: 'annoyed',
        text: 'Ein KANINCHEN. Ich habe eine ganze Flotte kommandiert und jetzt zittere ich wegen einem KANINCHEN.',
      },
      {
        speaker: 'princess',
        emotion: 'sarcastic',
        text: 'Manchmal ist die größte Bedrohung die eigene Fantasie.',
      },
    ],
  },
  'rustling-creature-diplomacy-fallback': {
    id: 'rustling-creature-diplomacy-fallback',
    trigger: 'manual',
    once: true,
    hasPlayed: false,
    lines: [
      {
        speaker: 'narrator',
        text: 'Laja versucht, den Blick ruhig zu halten – doch Helix kann es nicht lassen, hinter ihr nervös von einem Fuß auf den anderen zu hüpfen.',
      },
      {
        speaker: 'princess',
        emotion: 'annoyed',
        text: 'Helix. HELIX. Halten Sie still, Sie verscheuchen es ja selbst!',
      },
      {
        speaker: 'helix',
        emotion: 'panicked',
        text: 'Ich stehe doch völlig still! Nur meine Beine machen, was sie wollen!',
      },
      {
        speaker: 'narrator',
        text: 'Das Gebüsch zittert ein letztes Mal heftig – und wird dann vollkommen still. Was auch immer dort war, ist bereits über alle Berge, ohne sich zu zeigen.',
      },
      {
        speaker: 'princess',
        emotion: 'sarcastic',
        text: 'Beeindruckend. Sie haben es geschafft, ein Tier zu verscheuchen, das wir nicht einmal angreifen wollten.',
      },
    ],
  },

  'rustling-creature-strength-outcome': {
    id: 'rustling-creature-strength-outcome',
    trigger: 'manual',
    once: true,
    hasPlayed: false,
    lines: [
      {
        speaker: 'narrator',
        text: 'Helix schlägt wild um sich, brüllt in einer Lautstärke, die eigentlich für ganze Hafenstädte gedacht war, und das Gebüsch bebt unter dem Ansturm.',
      },
      {
        speaker: 'narrator',
        text: 'Ein einzelner, restlos überforderter kleiner Vogel schießt panisch aus den Blättern und verschwindet kreischend im Blätterdach.',
      },
      {
        speaker: 'helix',
        emotion: 'triumphant',
        text: 'Siehst du? Mein Kapitänsschrei hat es in die Flucht geschlagen!',
      },
      {
        speaker: 'princess',
        emotion: 'sarcastic',
        text: 'Ein Vogel. Sie haben soeben einen einzelnen Vogel in die Flucht geschlagen. Die Legenden werden sich überschlagen.',
      },
      {
        speaker: 'helix',
        emotion: 'smug',
        text: 'Ruhm beginnt klein, Eure Durchlaucht.',
      },
    ],
  },
  'rustling-creature-strength-fallback': {
    id: 'rustling-creature-strength-fallback',
    trigger: 'manual',
    once: true,
    hasPlayed: false,
    lines: [
      {
        speaker: 'narrator',
        text: 'Helix schlägt und brüllt, doch der Schwung lässt schnell nach – zu viel Kisten-Schleppen, zu wenig Übung im echten Kapitäns-Gebrüll.',
      },
      {
        speaker: 'helix',
        emotion: 'panicked',
        text: 'VERSCHWINDE! Äh... bitte? Verschwinde bitte, Kreatur?',
      },
      {
        speaker: 'narrator',
        text: 'Das Rascheln hört einfach auf. Kein Fauchen, kein Flüchten, kein Triumph – es wurde offenbar einfach nur müde, zuzuhören.',
      },
      {
        speaker: 'princess',
        emotion: 'sarcastic',
        text: 'War das Ihr Versuch, den Räuberhauptmann zu mimen? Ich bin beinahe eingeschlafen.',
      },
      {
        speaker: 'helix',
        emotion: 'annoyed',
        text: 'Das Publikum war einfach schlecht heute.',
      },
    ],
  },

  'monkey-heist-intro': {
    id: 'monkey-heist-intro',
    trigger: 'manual',
    once: true,
    hasPlayed: false,
    lines: [
      {
        speaker: 'narrator',
        text: 'Kaum haben sich die beiden vom Schock der Strandung erholt, wartet das nächste Problem: Ihr restliches Gepäck hängt, fein säuberlich sortiert, in den Ästen über ihnen. Eine Horde Affen grinst herab.',
      },
      {
        speaker: 'helix',
        emotion: 'panicked',
        text: 'Ist das... mein Beutel? MEIN BEUTEL MIT DEM EINZIGEN BROT, DAS ICH GERETTET HABE?',
      },
      {
        speaker: 'princess',
        emotion: 'annoyed',
        text: 'Und das ist zufällig auch meine Reisekarte, ohne die wir hier vermutlich ewig im Kreis laufen werden.',
      },
      {
        speaker: 'narrator',
        text: 'Der Anführer der Affen – ein besonders selbstgefälliges Exemplar – hält die Karte hoch, als wäre sie sein neuestes Spielzeug.',
      },
      {
        speaker: 'princess',
        emotion: 'smug',
        text: 'Nun, Helix. Zeit für Ihre... geschätzten Fähigkeiten im Umgang mit zwielichtigem Gesindel.',
      },
      {
        speaker: 'helix',
        emotion: 'annoyed',
        text: 'Sie meinen "Verhandeln"? Weil Sie sich zu fein sind, es selbst zu tun?',
      },
      {
        speaker: 'narrator',
        text: 'Wie auch immer ihr vorgeht – die Affen beobachten jede Bewegung gespannt.',
      },
    ],
  },

  'monkey-heist-step1-intro': {
    id: 'monkey-heist-step1-intro',
    trigger: 'manual',
    once: true,
    hasPlayed: false,
    lines: [
      {
        speaker: 'narrator',
        text: 'Die Affen sind längst wieder in den Bäumen verschwunden – mitsamt der Beute. Nur vereinzelte Fußspuren und geknickte Zweige zeigen, wohin es ging.',
      },
      {
        speaker: 'helix',
        emotion: 'annoyed',
        text: 'Also gut. Folgen wir den Spuren, bevor mein Brot zu affigem Kompott verarbeitet wird.',
      },
      {
        speaker: 'princess',
        emotion: 'sarcastic',
        text: 'Wie zivilisiert von Ihnen, das Offensichtliche auszusprechen. Und wie schlagen Sie vor, dass wir das tun?',
      },
      {
        speaker: 'helix',
        emotion: 'smug',
        text: 'Mit Stil natürlich. Oder mit roher Gewalt. Beides hat seinen Charme.',
      },
    ],
  },

  'monkey-heist-step1-diplomacy-outcome': {
    id: 'monkey-heist-step1-diplomacy-outcome',
    trigger: 'manual',
    once: true,
    hasPlayed: false,
    lines: [
      {
        speaker: 'narrator',
        text: 'Laja geht in die Hocke, betrachtet die Abdrücke im Sand genau und folgt ihnen mit ruhiger Präzision – als läse sie eine besonders unhöfliche Einladung.',
      },
      {
        speaker: 'princess',
        emotion: 'smug',
        text: 'Sehen Sie, Helix? Man muss nur genau hinsehen. Diese Spur hier ist frisch, jene dort ist ein Ablenkungsmanöver.',
      },
      {
        speaker: 'helix',
        emotion: 'confused',
        text: 'Ein Ablenkungsmanöver? Von AFFEN?',
      },
      {
        speaker: 'princess',
        emotion: 'sarcastic',
        text: 'Unterschätzen Sie niemals die Hinterlist von etwas, das Ihnen beim Klettern überlegen ist.',
      },
      {
        speaker: 'narrator',
        text: 'Die Spur führt zielsicher tiefer in den Urwald, zu einer Lichtung, auf der eine ganze Affentruppe lagert.',
      },
    ],
  },
  'monkey-heist-step1-diplomacy-fallback': {
    id: 'monkey-heist-step1-diplomacy-fallback',
    trigger: 'manual',
    once: true,
    hasPlayed: false,
    lines: [
      {
        speaker: 'narrator',
        text: 'Laja versucht, sich an ihre Etikette-Stunden über "aufmerksames Beobachten" zu erinnern. Es hilft nur bedingt bei Affen-Fährten.',
      },
      {
        speaker: 'princess',
        emotion: 'confused',
        text: 'Diese Spur führt... nach links. Oder rechts. Definitiv in eine dieser beiden Richtungen.',
      },
      {
        speaker: 'helix',
        emotion: 'sarcastic',
        text: 'Beeindruckend präzise, Eure Durchlaucht.',
      },
      {
        speaker: 'narrator',
        text: 'Nach einigem Herumirren – und mehr Glück als Können – stolpert das Duo dennoch auf eine Lichtung, auf der eine ganze Affentruppe lagert.',
      },
    ],
  },

  'monkey-heist-step1-strength-outcome': {
    id: 'monkey-heist-step1-strength-outcome',
    trigger: 'manual',
    once: true,
    hasPlayed: false,
    lines: [
      {
        speaker: 'narrator',
        text: 'Helix stapft ohne Umschweife ins Dickicht, bricht Äste beiseite und folgt dem Krach, den eine hastig flüchtende Affenbande zwangsläufig hinterlässt.',
      },
      {
        speaker: 'helix',
        emotion: 'smug',
        text: 'Subtilität ist überbewertet. Man muss nur lauter sein als das, was man jagt.',
      },
      {
        speaker: 'princess',
        emotion: 'annoyed',
        text: 'Oder leiser. Aber gut, dass Sie wenigstens EINE Strategie beherrschen.',
      },
      {
        speaker: 'narrator',
        text: 'Der direkte Weg zahlt sich aus: Schon nach kurzer Zeit erreicht das Duo eine Lichtung, auf der eine ganze Affentruppe lagert.',
      },
    ],
  },
  'monkey-heist-step1-strength-fallback': {
    id: 'monkey-heist-step1-strength-fallback',
    trigger: 'manual',
    once: true,
    hasPlayed: false,
    lines: [
      {
        speaker: 'narrator',
        text: 'Laja versucht, sich Helix\' Methode anzueignen und stapft entschlossen ins Unterholz – stolpert dabei prompt über die eigenen Röcke.',
      },
      {
        speaker: 'princess',
        emotion: 'panicked',
        text: 'Das war... eine taktische Bodenberührung. Vollkommen beabsichtigt.',
      },
      {
        speaker: 'helix',
        emotion: 'sarcastic',
        text: 'Natürlich. Genau wie der Ast, der gerade in Ihrer Frisur hängt.',
      },
      {
        speaker: 'narrator',
        text: 'Wenig elegant, aber immerhin wirkungsvoll: Der Lärm lockt sie direkt zu einer Lichtung, auf der eine ganze Affentruppe lagert.',
      },
    ],
  },

  'monkey-heist-step2-intro': {
    id: 'monkey-heist-step2-intro',
    trigger: 'manual',
    once: true,
    hasPlayed: false,
    lines: [
      {
        speaker: 'narrator',
        text: 'Zwischen den Ästen hängt das gesamte geraubte Gepäck, fein säuberlich drapiert. Der Anführer der Truppe – erkennbar am besonders überheblichen Grinsen – hält die Karte wie eine Trophäe hoch.',
      },
      {
        speaker: 'helix',
        emotion: 'panicked',
        text: 'Er... er posiert damit. Der Affe POSIERT.',
      },
      {
        speaker: 'princess',
        emotion: 'annoyed',
        text: 'Wie unangenehm vertraut. Nun, wie lösen wir das, ohne dass jemand von uns beiden dabei gebissen wird?',
      },
      {
        speaker: 'helix',
        emotion: 'confused',
        text: 'Optionen: wir bestechen sie, oder wir machen ihnen klar, wer hier die Nahrungskette anführt.',
      },
    ],
  },

  'monkey-heist-step2-diplomacy-outcome': {
    id: 'monkey-heist-step2-diplomacy-outcome',
    trigger: 'manual',
    once: true,
    hasPlayed: false,
    lines: [
      {
        speaker: 'narrator',
        text: 'Laja hält ruhig eine Auswahl wilder Früchte hoch – sortiert nach Größe, versteht sich – und bietet sie mit einer Verbeugung an, die selbst am Hof für Aufsehen gesorgt hätte.',
      },
      {
        speaker: 'princess',
        emotion: 'smug',
        text: 'Ein Austausch unter... nun, sagen wir: gleichrangigen Würdenträgern.',
      },
      {
        speaker: 'narrator',
        text: 'Der Anführer mustert das Angebot, dann Laja, dann wieder das Angebot – und lässt schließlich, mit einer fast höflichen Geste, die Karte fallen.',
      },
      {
        speaker: 'helix',
        emotion: 'confused',
        text: 'Das hat tatsächlich funktioniert. Ich bin... beunruhigt und beeindruckt zugleich.',
      },
      {
        speaker: 'narrator',
        text: 'Die Affen ziehen sich zurück – und lassen neben der Karte auch den Rest des Gepäcks zurück.',
      },
    ],
  },
  'monkey-heist-step2-diplomacy-fallback': {
    id: 'monkey-heist-step2-diplomacy-fallback',
    trigger: 'manual',
    once: true,
    hasPlayed: false,
    lines: [
      {
        speaker: 'narrator',
        text: 'Helix versucht sich an Lajas Verbeugung, hält ihr eine matschige Frucht hin und wirkt dabei eher wie jemand, der um Gnade bettelt.',
      },
      {
        speaker: 'helix',
        emotion: 'panicked',
        text: 'Bitte. Bitte, kleiner Freund. Ich habe Familie. Gläubiger. Ein sehr kompliziertes Leben.',
      },
      {
        speaker: 'princess',
        emotion: 'sarcastic',
        text: 'Fesselnde Verhandlungstaktik. Vermutlich aus Ihrer Zeit als Räuberhauptmann?',
      },
      {
        speaker: 'narrator',
        text: 'Der Anführer schmeißt die Frucht zurück – trifft Helix direkt im Gesicht – lässt aber, aus schierem Mitleid, die Karte fallen.',
      },
    ],
  },

  'monkey-heist-step2-strength-outcome': {
    id: 'monkey-heist-step2-strength-outcome',
    trigger: 'manual',
    once: true,
    hasPlayed: false,
    lines: [
      {
        speaker: 'narrator',
        text: 'Helix sammelt hastig einen Armvoll Kokosnüsse, wiegt die erste prüfend in der Hand und holt aus wie ein Mann, der seinen einzigen verbliebenen Lebenszweck gefunden hat.',
      },
      {
        speaker: 'helix',
        emotion: 'smug',
        text: 'ICH BIN SCHLIMM HELIX KISTEN, SCHRECKEN DER SIEBEN MEERE – UND JETZT AUCH TREFFSICHERER KOKOSNUSS-WERFER!',
      },
      {
        speaker: 'princess',
        emotion: 'confused',
        text: 'Sieben Meere? Wir sind auf EINER Insel gestrandet. Aber... das war tatsächlich ein guter Wurf.',
      },
      {
        speaker: 'narrator',
        text: 'Wurf um Wurf trifft präzise neben den Anführer – nah genug, um zu beeindrucken, ohne jemanden zu verletzen. Beeindruckt lässt er die Karte fallen und verschwindet mit seiner Truppe kreischend im Blätterdach.',
      },
      {
        speaker: 'princess',
        emotion: 'sarcastic',
        text: 'Nun, das hätte ich nicht erwartet. Immerhin gut für etwas: Wurfgeschosse.',
      },
    ],
  },
  'monkey-heist-step2-strength-fallback': {
    id: 'monkey-heist-step2-strength-fallback',
    trigger: 'manual',
    once: true,
    hasPlayed: false,
    lines: [
      {
        speaker: 'narrator',
        text: 'Laja greift entschlossen nach einer Kokosnuss, wirft – und verfehlt den Anführer um mehrere gute Meter, dafür trifft sie einen völlig unbeteiligten Busch mit beachtlicher Wucht.',
      },
      {
        speaker: 'princess',
        emotion: 'panicked',
        text: 'Das war... ein taktischer Warnschuss. Vollkommen beabsichtigt.',
      },
      {
        speaker: 'helix',
        emotion: 'sarcastic',
        text: 'Beeindruckend. Der Busch wird sich das für immer merken.',
      },
      {
        speaker: 'narrator',
        text: 'Die Affen sind eher verwirrt als eingeschüchtert von der fliegenden Kokosnuss-Salve, verlieren aber gelangweilt das Interesse und lassen die Karte samt Gepäck fallen.',
      },
    ],
  },

  'monkey-heist-step3-intro': {
    id: 'monkey-heist-step3-intro',
    trigger: 'manual',
    once: true,
    hasPlayed: false,
    lines: [
      {
        speaker: 'narrator',
        text: 'Zurück bleibt das gesamte Gepäck – bis auf ein Detail: Etwas fehlt noch. Ein glänzender Gegenstand, den die Affen offenbar gesondert versteckt haben, bevor sie geflüchtet sind.',
      },
      {
        speaker: 'helix',
        emotion: 'confused',
        text: 'Warten Sie. Die hatten noch MEHR Beute? Wie viel Gepäck hatten wir eigentlich dabei?',
      },
      {
        speaker: 'princess',
        emotion: 'annoyed',
        text: 'Genug, um standesgemäß zu reisen. Und jetzt konzentrieren Sie sich: Wo würde man hier etwas Glänzendes verstecken?',
      },
    ],
  },

  'monkey-heist-step3-strength-outcome': {
    id: 'monkey-heist-step3-strength-outcome',
    trigger: 'manual',
    once: true,
    hasPlayed: false,
    lines: [
      {
        speaker: 'narrator',
        text: 'Helix folgt seinem Bauchgefühl – wortwörtlich, denn es knurrt vor Hunger – direkt zu einem hohlen Baumstumpf.',
      },
      {
        speaker: 'helix',
        emotion: 'triumphant',
        text: 'Wenn ICH etwas verstecken wollte, würde ich es genau dahin legen, wo niemand freiwillig hineingreift.',
      },
      {
        speaker: 'princess',
        emotion: 'sarcastic',
        text: 'Eine erschreckend aufschlussreiche Einsicht in Ihr Wesen.',
      },
      {
        speaker: 'narrator',
        text: 'Im Stumpf, zwischen Moos und einigen empörten Käfern, liegt ein alter, leicht verrosteter Kompass – daneben, notdürftig in Blätter gewickelt, auch der vermisste Proviant.',
      },
    ],
  },
  'monkey-heist-step3-strength-fallback': {
    id: 'monkey-heist-step3-strength-fallback',
    trigger: 'manual',
    once: true,
    hasPlayed: false,
    lines: [
      {
        speaker: 'narrator',
        text: 'Laja versucht es mit Instinkt, wählt aber vor allem Verstecke, die "elegant" wirken – eine hohle Blüte, ein besonders dekoratives Blatt.',
      },
      {
        speaker: 'princess',
        emotion: 'confused',
        text: 'Es muss doch IRGENDWO sein, das auch nur ansatzweise repräsentabel aussieht.',
      },
      {
        speaker: 'helix',
        emotion: 'sarcastic',
        text: 'Affen legen selten Wert auf Interieur, Eure Durchlaucht.',
      },
      {
        speaker: 'narrator',
        text: 'Nach einigem Suchen entdeckt Helix – eher zufällig, beim Stolpern – den Kompass und den Rest des Proviants in einem hohlen Baumstumpf.',
      },
    ],
  },

  'monkey-heist-step3-diplomacy-outcome': {
    id: 'monkey-heist-step3-diplomacy-outcome',
    trigger: 'manual',
    once: true,
    hasPlayed: false,
    lines: [
      {
        speaker: 'narrator',
        text: 'Laja geht das Problem methodisch an: Sie rekonstruiert den wahrscheinlichsten Fluchtweg der Affen und leitet daraus das plausibelste Versteck ab.',
      },
      {
        speaker: 'princess',
        emotion: 'smug',
        text: 'Ein Muster erkennt man nur, wenn man aufhört, wild herumzustapfen. Dort. Dieser Termitenhügel wirkt zu ordentlich für die Natur.',
      },
      {
        speaker: 'helix',
        emotion: 'confused',
        text: 'Das ist... beunruhigend logisch für jemanden, der eben noch über Etikette dozierte.',
      },
      {
        speaker: 'narrator',
        text: 'Tatsächlich: Im Termitenhügel, zwischen aufgebrachten Insekten, liegt ein alter, leicht verrosteter Kompass – und, sorgfältig verstaut, der gerettete Proviant.',
      },
    ],
  },
  'monkey-heist-step3-diplomacy-fallback': {
    id: 'monkey-heist-step3-diplomacy-fallback',
    trigger: 'manual',
    once: true,
    hasPlayed: false,
    lines: [
      {
        speaker: 'narrator',
        text: 'Helix versucht sich an Lajas methodischem Ansatz, verheddert sich aber schnell in seiner eigenen Logik.',
      },
      {
        speaker: 'helix',
        emotion: 'confused',
        text: 'Wenn ich ein Affe wäre... und etwas verstecken wollte... würde ich... es einfach essen?',
      },
      {
        speaker: 'princess',
        emotion: 'sarcastic',
        text: 'Eine zutiefst erhellende Methode. Lassen Sie MICH das systematisch angehen.',
      },
      {
        speaker: 'narrator',
        text: 'Laja übernimmt, rekonstruiert in Ruhe den Fluchtweg – und findet prompt einen alten, leicht verrosteten Kompass samt dem geretteten Proviant in einem Termitenhügel.',
      },
    ],
  },

  'cave-of-e-buff-intro': {
    id: 'cave-of-e-buff-intro',
    trigger: 'interaction',
    once: true,
    hasPlayed: false,
    lines: [
      {
        speaker: 'narrator',
        text: 'Der Höhleneingang ist schmaler als gedacht, doch drinnen ist es warm erleuchtet – von einem improvisierten Lagerfeuer und Dutzenden aufgehängten, selbstgenähten Boxhandschuhen.',
      },
      {
        speaker: 'narrator',
        text: 'Aus dem Dunkel kommt rhythmisches Schnauben. Etwas tänzelt im Schatten. Etwas boxt gegen die Luft.',
      },
      {
        speaker: 'helix',
        emotion: 'panicked',
        text: 'Bitte sag mir, dass das ein besonders sportlicher Bär ist.',
      },
      {
        speaker: 'narrator',
        text: 'Aus dem Schatten springt eine wilde Gestalt: zerzauster Bart, Hände in Lumpen gewickelt, Kleidung aus Segeltuch. Ä-Buff, offenbar hocherfreut, endlich Publikum zu haben.',
      },
      {
        speaker: 'helix',
        emotion: 'panicked',
        text: 'ENDLICH! Frisches... äh, ich meine: Herausforderer!',
      },
      {
        speaker: 'princess',
        emotion: 'confused',
        text: 'Verzeihung, wer sind Sie, und warum tragen Sie Boxhandschuhe aus, wie es aussieht, ehemaligen Segeln?',
      },
      {
        speaker: 'helix',
        emotion: 'panicked',
        text: 'Wir suchen nur Informationen über die Insel, wir wollen nicht–',
      },
      {
        speaker: 'narrator',
        text: '"Regel Nummer eins der Höhle", unterbricht Ä-Buff und tänzelt bereits in Kampfhaltung, "wer reinkommt, boxt. Regel Nummer zwei: Ich hab noch nie verloren, weil noch nie jemand reingekommen ist."',
      },
      {
        speaker: 'princess',
        emotion: 'sarcastic',
        text: 'Eine beeindruckend lückenlose Erfolgsbilanz.',
      },
      {
        speaker: 'narrator',
        text: 'Ä-Buff wartet, boxend, auf eine Antwort. Sein Insel-Wissen – Gerüchten zufolge exzellent – bleibt vorerst hinter einer Deckung aus Fäusten verborgen.',
      },
    ],
  },

  'cave-step1-intro': {
    id: 'cave-step1-intro',
    trigger: 'interaction',
    once: true,
    hasPlayed: false,
    lines: [
      {
        speaker: 'helix',
        emotion: 'panicked',
        text: 'Optionen: Wir reden ihn runter. Oder ich schwitze mit ihm den Konflikt aus. Beides riskant, beides schneller als Verhungern.',
      },
      {
        speaker: 'princess',
        emotion: 'annoyed',
        text: 'Oder wir nutzen, für einmal, unseren gesunden Menschenverstand?',
      },
      {
        speaker: 'narrator',
        text: 'Ä-Buff hüpft ungeduldig von einem Fuß auf den anderen und wartet, boxend, auf eine Antwort.',
      },
    ],
  },

  'cave-step1-diplomacy-outcome': {
    id: 'cave-step1-diplomacy-outcome',
    trigger: 'interaction',
    once: true,
    hasPlayed: false,
    lines: [
      {
        speaker: 'narrator',
        text: 'Laja hebt beide Hände, nicht zur Deckung, sondern zur Aufmerksamkeit – und beginnt, mit bemerkenswerter Autorität, seine Fußarbeit zu kommentieren.',
      },
      {
        speaker: 'princess',
        emotion: 'smug',
        text: 'Beeindruckende Beinarbeit, muss ich sagen. Ungewöhnlich sauber für jemanden ohne Trainingspartner.',
      },
      {
        speaker: 'narrator',
        text: 'Ä-Buff hält mitten in der Bewegung inne, sichtlich geschmeichelt. Niemand hat seine Technik seit Jahren gelobt.',
      },
      {
        speaker: 'helix',
        emotion: 'confused',
        text: 'Das funktioniert tatsächlich. Ich bin fassungslos und ein bisschen neidisch.',
      },
      {
        speaker: 'narrator',
        text: 'Die Fäuste sinken. Ä-Buff setzt sich, immer noch leicht schnaufend, ans Feuer und deutet einladend auf zwei umgedrehte Fässer als Sitzgelegenheit.',
      },
    ],
  },
  'cave-step1-diplomacy-fallback': {
    id: 'cave-step1-diplomacy-fallback',
    trigger: 'interaction',
    once: true,
    hasPlayed: false,
    lines: [
      {
        speaker: 'narrator',
        text: 'Helix versucht sich an Diplomatie, was ungefähr so überzeugend wirkt wie ein Wolf, der um Erlaubnis bittet, die Schafe zählen zu dürfen.',
      },
      {
        speaker: 'helix',
        emotion: 'panicked',
        text: 'Toller... äh... Haken! Wirklich. Sehr rund. Sehr... faustförmig.',
      },
      {
        speaker: 'princess',
        emotion: 'sarcastic',
        text: 'Ein Kompliment von historischem Tiefgang.',
      },
      {
        speaker: 'narrator',
        text: 'Ä-Buff hält inne – nicht weil er überzeugt ist, sondern weil er so herzlich lachen muss, dass er fast das Gleichgewicht verliert. Die Fäuste sinken trotzdem.',
      },
    ],
  },

  'cave-step1-strength-outcome': {
    id: 'cave-step1-strength-outcome',
    trigger: 'interaction',
    once: true,
    hasPlayed: false,
    lines: [
      {
        speaker: 'narrator',
        text: 'Helix rollt die Schultern, alte Reflexe aus Räuberhauptmann-Tagen kehren zurück, und geht tatsächlich in Deckung.',
      },
      {
        speaker: 'helix',
        emotion: 'smug',
        text: 'Na schön, Ä-Buff. Zeig mir, was die Insel aus dir gemacht hat.',
      },
      {
        speaker: 'narrator',
        text: 'Es folgt ein respektables Hin und Her aus Ausweichen, Antäuschen und einem einzelnen, überraschend eleganten Konter. Kein klarer Sieger – aber ein klarer Respekt.',
      },
      {
        speaker: 'princess',
        emotion: 'confused',
        text: 'Ich wusste nicht, dass Sie das können. Beunruhigend.',
      },
      {
        speaker: 'narrator',
        text: 'Ä-Buff, außer Atem und grinsend, lässt die Fäuste sinken und klopft Helix anerkennend auf die Schulter.',
      },
    ],
  },
  'cave-step1-strength-fallback': {
    id: 'cave-step1-strength-fallback',
    trigger: 'interaction',
    once: true,
    hasPlayed: false,
    lines: [
      {
        speaker: 'narrator',
        text: 'Laja, entschlossen, es Helix gleichzutun, hebt die Fäuste in einer Haltung, die eher an eine Ballettpose als an Kampfsport erinnert.',
      },
      {
        speaker: 'princess',
        emotion: 'panicked',
        text: 'Für Insel, Krone und... äh... was auch immer man hier ruft!',
      },
      {
        speaker: 'helix',
        emotion: 'sarcastic',
        text: 'Das war weniger Boxkampf, mehr höfischer Tanz mit Zwischenfall.',
      },
      {
        speaker: 'narrator',
        text: 'Ä-Buff lacht so sehr über die schiere Unbekümmertheit dieses Angriffs, dass er kapitulierend die Hände hebt – beeindruckt von so viel Mut ohne jedes Talent.',
      },
    ],
  },

  'cave-step2-intro': {
    id: 'cave-step2-intro',
    trigger: 'interaction',
    once: true,
    hasPlayed: false,
    lines: [
      {
        speaker: 'narrator',
        text: 'Am Feuer entpuppt sich Ä-Buff als überraschend gesprächig. Bevor er jedoch sein Insel-Wissen preisgibt, will er noch etwas: echtes Interesse an seiner Lebensgeschichte.',
      },
      {
        speaker: 'helix',
        emotion: 'annoyed',
        text: 'Natürlich will er das. Niemand teilt hier einfach mal Informationen.',
      },
      {
        speaker: 'princess',
        emotion: 'smug',
        text: 'Nun, wir sind ja auch nicht hier, um es UNS leicht zu machen.',
      },
    ],
  },

  'cave-step2-diplomacy-outcome': {
    id: 'cave-step2-diplomacy-outcome',
    trigger: 'interaction',
    once: true,
    hasPlayed: false,
    lines: [
      {
        speaker: 'narrator',
        text: 'Laja bewundert ausführlich die an der Höhlenwand befestigten Trophäen – größtenteils Treibholz in Pokalform, mit stolz eingeritzten Jahreszahlen.',
      },
      {
        speaker: 'princess',
        emotion: 'smug',
        text: 'Dieser hier – "Meister der Lagune, dritte Saison" – erzählen Sie mir mehr.',
      },
      {
        speaker: 'narrator',
        text: 'Ä-Buff blüht regelrecht auf und erzählt, zwischen begeisterten Anekdoten über imaginäre Gegner, nebenbei alles, was er über die Insel weiß.',
      },
      {
        speaker: 'helix',
        emotion: 'confused',
        text: 'Ich habe nichts von dem verstanden, was gerade über "Kokosnuss-Runde vier" gesagt wurde, aber offenbar war es wichtig.',
      },
      {
        speaker: 'narrator',
        text: 'Am Ende drückt Ä-Buff ihnen eine aus Rinde und Kohle gezeichnete Insel-Skizze in die Hand – überraschend detailliert für jemanden, der seine Trophäen aus Treibholz schnitzt.',
      },
    ],
  },
  'cave-step2-diplomacy-fallback': {
    id: 'cave-step2-diplomacy-fallback',
    trigger: 'interaction',
    once: true,
    hasPlayed: false,
    lines: [
      {
        speaker: 'narrator',
        text: 'Helix versucht, sich für die Treibholz-Trophäen zu begeistern, wirkt dabei aber wie jemand, der Höflichkeitsfloskeln aus einem Buch abliest.',
      },
      {
        speaker: 'helix',
        emotion: 'panicked',
        text: 'Wow. Holz. In Pokalform. Absolut... hölzern.',
      },
      {
        speaker: 'princess',
        emotion: 'sarcastic',
        text: 'Eine Meisterleistung der Konversation.',
      },
      {
        speaker: 'narrator',
        text: 'Ä-Buff bemerkt das mangelnde Interesse, ist aber ohnehin viel zu redselig, um sich beirren zu lassen, und erzählt trotzdem alles Wissenswerte über die Insel – nur eben ausführlicher als nötig.',
      },
      {
        speaker: 'narrator',
        text: 'Zum Abschied drückt er ihnen eine aus Rinde und Kohle gezeichnete Insel-Skizze in die Hand.',
      },
    ],
  },

  'cave-step2-strength-outcome': {
    id: 'cave-step2-strength-outcome',
    trigger: 'interaction',
    once: true,
    hasPlayed: false,
    lines: [
      {
        speaker: 'narrator',
        text: 'Helix tauscht Kampfgeschichten aus – stark ausgeschmückte Räuberhauptmann-Anekdoten gegen Ä-Buffs nicht minder übertriebene Boxlegenden.',
      },
      {
        speaker: 'helix',
        emotion: 'smug',
        text: 'Und DANN, mit nur einer Hand am Ruder, habe ich die gesamte Hafenwache verhandelt – nicht bekämpft, verhandelt, das ist wichtig – in die Flucht geschlagen.',
      },
      {
        speaker: 'narrator',
        text: 'Ä-Buff ist begeistert, tauscht Geschichte um Geschichte, und in seiner guten Stimmung sprudeln nebenbei sämtliche Insel-Geheimnisse heraus.',
      },
      {
        speaker: 'princess',
        emotion: 'sarcastic',
        text: 'Wer hätte gedacht, dass Angeberei eine Informationsquelle sein kann.',
      },
      {
        speaker: 'narrator',
        text: 'Zum Abschluss überreicht Ä-Buff, fast schon feierlich, eine aus Rinde und Kohle gezeichnete Insel-Skizze.',
      },
    ],
  },
  'cave-step2-strength-fallback': {
    id: 'cave-step2-strength-fallback',
    trigger: 'interaction',
    once: true,
    hasPlayed: false,
    lines: [
      {
        speaker: 'narrator',
        text: 'Laja versucht sich an einer eigenen "Kampfgeschichte", die eher von einem besonders unhöflichen Höfling handelt als von echtem Kampf.',
      },
      {
        speaker: 'princess',
        emotion: 'confused',
        text: 'Und DANN habe ich ihm einen zutiefst vernichtenden Blick zugeworfen. Er hat sich nie wieder blicken lassen.',
      },
      {
        speaker: 'helix',
        emotion: 'sarcastic',
        text: 'Fesselnd. Ich spüre förmlich die Klingen kreuzen.',
      },
      {
        speaker: 'narrator',
        text: 'Ä-Buff findet die Geschichte trotzdem herrlich unterhaltsam – vor allem, weil er sie offenkundig nicht ernst nimmt – und plaudert gut gelaunt sein gesamtes Insel-Wissen aus.',
      },
      {
        speaker: 'narrator',
        text: 'Zuletzt drückt er ihnen eine aus Rinde und Kohle gezeichnete Insel-Skizze in die Hand.',
      },
    ],
  },

  'ambient-beach-shell': {
    id: 'ambient-beach-shell',
    trigger: 'tile-reveal',
    once: true,
    hasPlayed: false,
    lines: [
      { speaker: 'narrator', text: 'Zwischen dem Sand liegt eine ungewöhnlich große, glänzende Muschel.' },
      { speaker: 'princess', emotion: 'smug', text: 'Die würde sich hervorragend als Broschen-Vorlage eignen.' },
      { speaker: 'helix', emotion: 'sarcastic', text: 'Oder als Waffe. Ich behalte alle Optionen offen.' },
    ],
  },
  'ambient-beach-bottle': {
    id: 'ambient-beach-bottle',
    trigger: 'tile-reveal',
    once: true,
    hasPlayed: false,
    lines: [
      { speaker: 'narrator', text: 'Halb im Sand vergraben liegt eine verkorkte Flasche mit einer vergilbten Nachricht darin.' },
      { speaker: 'helix', emotion: 'panicked', text: 'Ein Hilferuf! Ein Schatzhinweis! Meine Rettung!' },
      { speaker: 'narrator', text: 'Die Nachricht entpuppt sich als halb verwischte Einkaufsliste. "Rum. Mehr Rum."' },
      { speaker: 'princess', emotion: 'sarcastic', text: 'Immerhin wissen wir jetzt, wer hier vor uns campiert hat.' },
    ],
  },

  'ambient-jungle-bird': {
    id: 'ambient-jungle-bird',
    trigger: 'tile-reveal',
    once: true,
    hasPlayed: false,
    lines: [
      { speaker: 'narrator', text: 'Mit einem grellen Kreischen schießt ein knallbunter Vogel aus dem Blätterdach.' },
      { speaker: 'helix', emotion: 'panicked', text: 'ANGRIFF! ÄH – FALSCHER ALARM. Nur ein Vogel.' },
      { speaker: 'princess', emotion: 'sarcastic', text: 'Ihre Reaktionszeit auf gefiederte Bedrohungen ist wirklich bemerkenswert.' },
    ],
  },
  'ambient-jungle-fruit': {
    id: 'ambient-jungle-fruit',
    trigger: 'tile-reveal',
    once: true,
    hasPlayed: false,
    lines: [
      { speaker: 'narrator', text: 'An einem niedrigen Ast hängt eine Frucht in einer Farbe, die die Natur eigentlich nicht vorgesehen hat.' },
      { speaker: 'helix', emotion: 'smug', text: 'Sieht essbar aus. Ich probiere.' },
      { speaker: 'princess', emotion: 'panicked', text: 'Helix, NEIN – wir wissen nicht, was das ist!' },
      { speaker: 'narrator', text: 'Er probiert trotzdem. Nichts passiert. Er wirkt fast enttäuscht darüber.' },
    ],
  },
  'ambient-jungle-vine': {
    id: 'ambient-jungle-vine',
    trigger: 'tile-reveal',
    once: true,
    hasPlayed: false,
    lines: [
      { speaker: 'narrator', text: 'Helix verheddert sich beim Vorangehen prompt in einer herabhängenden Ranke.' },
      { speaker: 'helix', emotion: 'confused', text: 'Das war Absicht. Eine Art... Tarnung.' },
      { speaker: 'princess', emotion: 'sarcastic', text: 'Getarnt als kopfüber hängender Abenteurer. Sehr überzeugend.' },
    ],
  },

  'ambient-lake-fish': {
    id: 'ambient-lake-fish',
    trigger: 'tile-reveal',
    once: true,
    hasPlayed: false,
    lines: [
      { speaker: 'narrator', text: 'Ein silbriger Fisch springt kurz aus dem Wasser und platscht zurück.' },
      { speaker: 'helix', emotion: 'confused', text: 'Aha. Nur ein Fisch. Ich hatte schon gehofft.' },
      { speaker: 'princess', emotion: 'sarcastic', text: 'Gehofft worauf genau? Auf ein weiteres Ungeheuer?' },
    ],
  },
  'ambient-lake-reflection': {
    id: 'ambient-lake-reflection',
    trigger: 'tile-reveal',
    once: true,
    hasPlayed: false,
    lines: [
      { speaker: 'narrator', text: 'Die Wasseroberfläche liegt spiegelglatt da – ein perfektes Abbild von Palmen und Himmel.' },
      { speaker: 'princess', emotion: 'smug', text: 'Endlich eine Spiegelfläche, die meiner würdig ist.' },
      { speaker: 'helix', emotion: 'sarcastic', text: 'Sie meinen, endlich eine, die nicht zurückredet.' },
    ],
  },

  'ambient-mountain-wind': {
    id: 'ambient-mountain-wind',
    trigger: 'tile-reveal',
    once: true,
    hasPlayed: false,
    lines: [
      { speaker: 'narrator', text: 'Eine plötzliche Windböe fegt über den Hang und reißt Helix beinahe die Mütze vom Kopf.' },
      { speaker: 'helix', emotion: 'panicked', text: 'Nicht die Mütze! Die Mütze ist Teil meines Images!' },
      { speaker: 'princess', emotion: 'sarcastic', text: 'Ihr Image wird den Verlust überleben, Helix.' },
    ],
  },
  'ambient-mountain-rocks': {
    id: 'ambient-mountain-rocks',
    trigger: 'tile-reveal',
    once: true,
    hasPlayed: false,
    lines: [
      { speaker: 'narrator', text: 'Unter Helix\' Stiefel löst sich ein loser Stein und poltert den Hang hinunter.' },
      { speaker: 'helix', emotion: 'panicked', text: 'Das war kalkuliert! Ich lockere den Weg für Sie!' },
      { speaker: 'princess', emotion: 'sarcastic', text: 'Wie aufopferungsvoll von Ihnen, beinahe zu stürzen.' },
    ],
  },

  'ambient-bay-driftwood': {
    id: 'ambient-bay-driftwood',
    trigger: 'tile-reveal',
    once: true,
    hasPlayed: false,
    lines: [
      { speaker: 'narrator', text: 'Ein Stück Treibholz liegt im seichten Wasser – auffällig regelmäßig geformt, fast wie ein kleines Ruder.' },
      { speaker: 'helix', emotion: 'confused', text: 'Sieht aus, als hätte hier schon mal jemand improvisiert.' },
      { speaker: 'princess', emotion: 'sarcastic', text: 'Klingt nach Ihrer Art von Seemannschaft.' },
    ],
  },

  'ambient-village-chicken': {
    id: 'ambient-village-chicken',
    trigger: 'tile-reveal',
    once: true,
    hasPlayed: false,
    lines: [
      { speaker: 'narrator', text: 'Ein aufgeregtes, hühnerähnliches Tier stolziert quer über den Weg und verschwindet im Gebüsch.' },
      { speaker: 'helix', emotion: 'smug', text: 'Mittagessen, direkt geliefert.' },
      { speaker: 'princess', emotion: 'annoyed', text: 'Das gehört vermutlich jemandem, Helix. Lassen Sie es.' },
    ],
  },
  'ambient-village-drums': {
    id: 'ambient-village-drums',
    trigger: 'tile-reveal',
    once: true,
    hasPlayed: false,
    lines: [
      { speaker: 'narrator', text: 'Aus der Ferne trägt der Wind einen gleichmäßigen Trommelrhythmus herüber.' },
      { speaker: 'helix', emotion: 'confused', text: 'Klingt fast einladend. Oder wie eine Kriegstrommel. Schwer zu sagen.' },
      { speaker: 'princess', emotion: 'smug', text: 'Wahrscheinlich einfach nur Musik, Helix. Nicht alles ist eine Bedrohung.' },
    ],
  },

  'lake-monster-tease': {
    id: 'lake-monster-tease',
    trigger: 'tile-reveal',
    once: true,
    hasPlayed: false,
    lines: [
      { speaker: 'narrator', text: 'Etwas Großes gleitet knapp unter der Wasseroberfläche vorbei.' },
      { speaker: 'helix', emotion: 'panicked', text: 'Hat... hat das Wasser gerade Zähne gehabt?' },
      { speaker: 'princess', emotion: 'sarcastic', text: 'Unwahrscheinlich. Wasser hat selten Zähne. Meistens.' },
      { speaker: 'helix', emotion: 'confused', text: '"Meistens" ist nicht das Wort, das ich gerade hören wollte.' },
    ],
  },

  'jungle-danger-tease': {
    id: 'jungle-danger-tease',
    trigger: 'tile-reveal',
    once: true,
    hasPlayed: false,
    lines: [
      { speaker: 'narrator', text: 'Ein Ast bricht ganz von allein. Niemand war in der Nähe.' },
      { speaker: 'princess', emotion: 'annoyed', text: 'Sagen Sie mir nicht, dass die Bäume hier auch noch launisch sind.' },
      { speaker: 'helix', emotion: 'panicked', text: 'Ich sage gar nichts. Ich gehe einfach ganz, ganz langsam rückwärts.' },
    ],
  },

  'pirate-bay-intro': {
    id: 'pirate-bay-intro',
    trigger: 'interaction',
    once: true,
    hasPlayed: false,
    lines: [
      {
        speaker: 'narrator',
        text: 'Abseits vom Schiff, versteckt zwischen den Klippen der Bucht, flackert ein kleines Feuer. Der Rauch verliert sich geschickt im Gestein.',
      },
      {
        speaker: 'helix',
        emotion: 'panicked',
        text: 'Das riecht nach Ärger. Genauer gesagt: nach genau der Sorte Ärger, die ich beruflich seit Jahren meide.',
      },
      {
        speaker: 'princess',
        emotion: 'sarcastic',
        text: 'Wie tröstlich, dass Ihre professionelle Einschätzung immer erst hinterher kommt.',
      },
      {
        speaker: 'narrator',
        text: 'Am Feuer sitzen zwei Gestalten, offensichtlich nicht überrascht von Besuch: Bilone und Bidate.',
      },
      {
        speaker: 'narrator',
        text: 'Zwei Piratinnen, wie sich herausstellt – sie führen die letzte verbliebene Crew der Bucht an, weit weg vom eigentlichen Schiff.',
      },
      {
        speaker: 'helix',
        emotion: 'panicked',
        text: 'Ich... ich kenne diese beiden. Beruflich. Es endete nicht gut.',
      },
      {
        speaker: 'princess',
        emotion: 'smug',
        text: 'Was für eine Überraschung. Nun, dann reden eben ausnahmsweise ich zuerst.',
      },
      {
        speaker: 'narrator',
        text: 'Ohne eine angeworbene Crew wird das Schiff in der Bucht niemand steuern. Die beiden Piratinnen mustern das Duo abschätzend.',
      },
    ],
  },

  'pirate-bay-step1-intro': {
    id: 'pirate-bay-step1-intro',
    trigger: 'interaction',
    once: true,
    hasPlayed: false,
    lines: [
      {
        speaker: 'narrator',
        text: 'Bilone verschränkt die Arme. "Ihr wollt unsere Crew? Dann müsst ihr erst gegen uns bestehen."',
      },
      {
        speaker: 'narrator',
        text: 'Bidate holt, ohne auf eine Antwort zu warten, eine abgegriffene Holzkiste hervor und kippt sie aus: Dominosteine, klackernd über den Sand verteilt.',
      },
      {
        speaker: 'helix',
        emotion: 'confused',
        text: 'Domino? Ich hatte eher mit einem Duell gerechnet.',
      },
      {
        speaker: 'narrator',
        text: '"Ein Duell wäre zu leise gewesen", sagt Bidate trocken. "Wir wollen sehen, ob ihr auch unter Druck einen klaren Kopf behaltet."',
      },
      {
        speaker: 'princess',
        emotion: 'smug',
        text: 'Nun, Strategiespiele sind zufällig meine Spezialität.',
      },
      {
        speaker: 'helix',
        emotion: 'annoyed',
        text: 'Und meine Spezialität ist es, gegen Bilone und Bidate zu verlieren. Das nur zur Fairness.',
      },
    ],
  },

  'pirate-bay-step1-outcome': {
    id: 'pirate-bay-step1-outcome',
    trigger: 'interaction',
    once: true,
    hasPlayed: false,
    lines: [
      {
        speaker: 'narrator',
        text: 'Stein um Stein legt das Duo überraschend zielsicher an – Laja kalkuliert, Helix legt hin und wieder wild, aber zufällig richtig.',
      },
      {
        speaker: 'narrator',
        text: 'Bilone und Bidate wechseln einen Blick. Zum ersten Mal seit Jahren verlieren sie eine Partie an ihrem eigenen Lagerfeuer.',
      },
      {
        speaker: 'helix',
        emotion: 'triumphant',
        text: 'Ha! Endlich mal ein Sieg gegen euch beide!',
      },
      {
        speaker: 'narrator',
        text: '"Zum letzten Mal", murmelt Bidate, halb genervt, halb beeindruckt, und pfeift die Crew zusammen.',
      },
      {
        speaker: 'princess',
        emotion: 'triumphant',
        text: 'Respekt gewinnt man eben doch am besten am Spieltisch, nicht im Handgemenge.',
      },
      {
        speaker: 'narrator',
        text: '"Abgemacht", sagt Bilone und reicht die Hand. "Die Crew segelt mit euch. Bringt nur das Schiff heil zurück – irgendwie."',
      },
    ],
  },
  'pirate-bay-step1-fallback': {
    id: 'pirate-bay-step1-fallback',
    trigger: 'interaction',
    once: true,
    hasPlayed: false,
    lines: [
      {
        speaker: 'narrator',
        text: 'Das Spiel läuft holprig: Helix legt Steine an, wo keine hinpassen, und Laja verliert mitten in einer eleganten Kalkulation den Faden.',
      },
      {
        speaker: 'helix',
        emotion: 'panicked',
        text: 'Das war Strategie! Eine sehr fortgeschrittene Strategie, die ihr nicht versteht!',
      },
      {
        speaker: 'princess',
        emotion: 'sarcastic',
        text: 'Die Strategie hieß "Panik", Helix.',
      },
      {
        speaker: 'narrator',
        text: 'Bilone und Bidate lachen so sehr, dass sie sich am Lagerfeuer festhalten müssen. Diese Vorstellung war die beste Unterhaltung seit Wochen.',
      },
      {
        speaker: 'narrator',
        text: '"Ehrlich gesagt", japst Bidate, "wart ihr so schlecht, dass wir es fast schade fänden, euch ohne Crew ziehen zu lassen."',
      },
      {
        speaker: 'narrator',
        text: 'Grinsend reicht Bilone trotzdem die Hand. Die Crew steht bereit – wenn auch mit einigen zweifelnden Blicken in Richtung Helix.',
      },
    ],
  },

  'native-village-intro': {
    id: 'native-village-intro',
    trigger: 'interaction',
    once: true,
    hasPlayed: false,
    lines: [
      { speaker: 'narrator', text: 'Neugierige Gesichter lugen aus den Hütten hervor.' },
      {
        speaker: 'princess',
        emotion: 'smug',
        text: 'Endlich! Zivilisation. Bringen Sie mir einen Tee und einen Thron.',
      },
      {
        speaker: 'helix',
        emotion: 'sarcastic',
        text: 'Ich glaube, die haben eher gehofft, dass WIR nett zu IHNEN sind.',
      },
      {
        speaker: 'narrator',
        text: 'Mehrere Dorfbewohner treten hervor, Arme verschränkt, wachsam – aber nicht feindselig. Ein Ältester mustert die beiden abwartend.',
      },
      {
        speaker: 'helix',
        emotion: 'panicked',
        text: 'Diese Haltung kenne ich. Das bedeutet Ärger. Zeit, ihnen zu zeigen, wer hier das Sagen hat!',
      },
      {
        speaker: 'princess',
        emotion: 'panicked',
        text: 'Helix, NEIN. Das ist ein Dorf, kein Beutezug!',
      },
      {
        speaker: 'narrator',
        text: 'Die Luft ist angespannt. Wie die beiden das jetzt angehen, entscheidet über alles Weitere.',
      },
    ],
  },

  'native-village-step1-intro': {
    id: 'native-village-step1-intro',
    trigger: 'interaction',
    once: true,
    hasPlayed: false,
    lines: [
      {
        speaker: 'helix',
        emotion: 'smug',
        text: 'Also, Plan: Ich mach mich groß, sie kriegen Angst, wir kriegen Respekt. Klassiker.',
      },
      {
        speaker: 'princess',
        emotion: 'annoyed',
        text: 'Oder Sie halten für einmal in Ihrem Leben die Klappe, und ICH rede.',
      },
      {
        speaker: 'narrator',
        text: 'Der Älteste wartet ab, um zu sehen, was diese Fremden zuerst tun.',
      },
    ],
  },

  'native-village-step1-diplomacy-outcome': {
    id: 'native-village-step1-diplomacy-outcome',
    trigger: 'interaction',
    once: true,
    hasPlayed: false,
    lines: [
      {
        speaker: 'narrator',
        text: 'Laja legt Helix eine Hand auf die Brust wie eine unsichtbare Mauer und tritt selbst einen Schritt vor, Handflächen offen.',
      },
      {
        speaker: 'princess',
        emotion: 'neutral',
        text: 'Wir kommen in Frieden. Mein Begleiter neigt lediglich zu... Übertreibungen.',
      },
      {
        speaker: 'helix',
        emotion: 'annoyed',
        text: 'Ich neige zu ANGEMESSENEN Reaktionen.',
      },
      {
        speaker: 'narrator',
        text: 'Der Älteste entspannt sich sichtlich, mustert die beiden aber weiterhin abwartend.',
      },
      {
        speaker: 'narrator',
        text: '"Fremde werden hier nicht mit Fäusten begrüßt", sagt er schließlich. "Respekt zeigt sich anders."',
      },
    ],
  },
  'native-village-step1-diplomacy-fallback': {
    id: 'native-village-step1-diplomacy-fallback',
    trigger: 'interaction',
    once: true,
    hasPlayed: false,
    lines: [
      {
        speaker: 'narrator',
        text: 'Laja greift eine Sekunde zu spät – Helix macht schon einen entschlossenen Schritt nach vorn, bevor sie ihn am Kragen zurückreißt.',
      },
      {
        speaker: 'helix',
        emotion: 'panicked',
        text: 'Ich hab doch nur... eine ausladende Begrüßungsgeste gemacht!',
      },
      {
        speaker: 'princess',
        emotion: 'sarcastic',
        text: 'Das nannte man früher "Kriegserklärung", Helix.',
      },
      {
        speaker: 'narrator',
        text: 'Der Älteste hebt eine Augenbraue – wirkt dabei eher amüsiert als beleidigt.',
      },
    ],
  },

  'native-village-step1-strength-outcome': {
    id: 'native-village-step1-strength-outcome',
    trigger: 'interaction',
    once: true,
    hasPlayed: false,
    lines: [
      {
        speaker: 'narrator',
        text: 'Helix richtet sich zu voller Größe auf, verschränkt die Arme und versucht, möglichst bedrohlich dreinzuschauen.',
      },
      {
        speaker: 'helix',
        emotion: 'smug',
        text: 'Wir kommen als... mächtige Reisende! Zeigt gebührenden Respekt!',
      },
      {
        speaker: 'narrator',
        text: 'Stille. Dann lacht der Älteste, herzlich und völlig ungeniert.',
      },
      {
        speaker: 'princess',
        emotion: 'sarcastic',
        text: 'Nun, immerhin haben Sie für Unterhaltung gesorgt.',
      },
      {
        speaker: 'narrator',
        text: 'Statt eines Kampfes schlägt der Älteste etwas anderes vor: einen Tanzwettbewerb – um zu sehen, ob den Fremden auch Rhythmus im Blut liegt.',
      },
    ],
  },
  'native-village-step1-strength-fallback': {
    id: 'native-village-step1-strength-fallback',
    trigger: 'interaction',
    once: true,
    hasPlayed: false,
    lines: [
      {
        speaker: 'narrator',
        text: 'Helix versucht sich aufzuplustern, verhaspelt sich aber mitten im Satz.',
      },
      {
        speaker: 'helix',
        emotion: 'confused',
        text: 'Wir kommen als... äh... mächtige... Moment, was wollte ich sagen?',
      },
      {
        speaker: 'narrator',
        text: 'Die Dorfbewohner kichern unverhohlen.',
      },
      {
        speaker: 'princess',
        emotion: 'sarcastic',
        text: 'Beeindruckend. Selbst das Scheitern schaffen Sie mit Stil.',
      },
      {
        speaker: 'narrator',
        text: 'Der Älteste, eher amüsiert als beunruhigt, schlägt vor, die Sache stattdessen mit einem Tanzwettbewerb zu klären.',
      },
    ],
  },

  'native-village-step2-intro': {
    id: 'native-village-step2-intro',
    trigger: 'interaction',
    once: true,
    hasPlayed: false,
    lines: [
      {
        speaker: 'narrator',
        text: 'Trommeln setzen ein. Die Dorfgemeinschaft versammelt sich im Kreis und klatscht den Takt.',
      },
      {
        speaker: 'helix',
        emotion: 'panicked',
        text: 'Ein TANZ? Das ist doch keine ernstzunehmende Konfliktlösung!',
      },
      {
        speaker: 'princess',
        emotion: 'smug',
        text: 'Sagt der Mann, der eben fast einen Krieg mit bloßen Armen begonnen hätte.',
      },
      {
        speaker: 'narrator',
        text: 'Ein junger Tänzer tritt vor und macht eine Schrittfolge vor. Jetzt liegt es an euch, sie nachzuahmen.',
      },
    ],
  },

  'native-village-step2-outcome': {
    id: 'native-village-step2-outcome',
    trigger: 'interaction',
    once: true,
    hasPlayed: false,
    lines: [
      {
        speaker: 'narrator',
        text: 'Erstaunlich synchron folgen die beiden jeder Bewegung – ein Sprung hier, eine Drehung da.',
      },
      {
        speaker: 'helix',
        emotion: 'confused',
        text: 'Ich wusste gar nicht, dass in mir sowas steckt.',
      },
      {
        speaker: 'princess',
        emotion: 'smug',
        text: 'Königlicher Etikette-Unterricht hat eben auch seine Tanzstunden.',
      },
      {
        speaker: 'narrator',
        text: 'Die Dorfgemeinschaft jubelt. Der Älteste tritt vor, sichtlich beeindruckt.',
      },
      {
        speaker: 'narrator',
        text: '"Wer unseren Rhythmus ehrt", sagt er, "dem vertrauen wir auch unsere Geheimnisse an."',
      },
      {
        speaker: 'narrator',
        text: 'Leise und eindringlich beschreibt er ihnen den Weg zu einem verborgenen Kajak.',
      },
      {
        speaker: 'narrator',
        text: '"Das Kajak Ova", sagt er, "bringt euch unbemerkt über die Bucht. Nutzt es weise."',
      },
    ],
  },
  'native-village-step2-fallback': {
    id: 'native-village-step2-fallback',
    trigger: 'interaction',
    once: true,
    hasPlayed: false,
    lines: [
      {
        speaker: 'narrator',
        text: 'Helix stampft entschlossen, aber gänzlich unpassend herum – zwei Schritte zu spät, eine Drehung zu viel.',
      },
      {
        speaker: 'princess',
        emotion: 'sarcastic',
        text: 'Das war... eine sehr eigene Interpretation von "Rhythmus".',
      },
      {
        speaker: 'helix',
        emotion: 'annoyed',
        text: 'Das war Freestyle!',
      },
      {
        speaker: 'narrator',
        text: 'Die Dorfgemeinschaft lacht, aber nicht unfreundlich – manche klatschen sogar mit, amüsiert von so viel Kreativität.',
      },
      {
        speaker: 'narrator',
        text: 'Der Älteste schüttelt lachend den Kopf, beschreibt ihnen aber trotzdem, eher aus Sympathie für den Mut, leise den Weg zu einem verborgenen Kajak.',
      },
      {
        speaker: 'narrator',
        text: '"Das Kajak Ova", sagt er grinsend, "hat schon Schlimmeres überstanden als euren Tanz. Nutzt es weise."',
      },
    ],
  },

  'finale-escape-intro': {
    id: 'finale-escape-intro',
    trigger: 'interaction',
    once: true,
    hasPlayed: false,
    lines: [
      {
        speaker: 'narrator',
        text: 'Kompass, Insel-Skizze, Königsschatz, der Hinweis auf ein verstecktes Kajak, eine angeworbene Crew – zum ersten Mal seit der Strandung fehlt tatsächlich nichts mehr.',
      },
      {
        speaker: 'helix',
        emotion: 'triumphant',
        text: 'Sehen Sie das? Genau so etwas erzählt man sich noch in Jahren an den Hafenschänken. "Der Tag, an dem Schlimm Helix Kisten alles zusammenhatte."',
      },
      {
        speaker: 'princess',
        emotion: 'sarcastic',
        text: 'Solange der Bericht auch "mehrfacher Schiffbruch" und "beinahe von Affen ausgeraubt" erwähnt, gerne.',
      },
      {
        speaker: 'narrator',
        text: 'Am Ufer der Bucht, gut versteckt unter Palmwedeln, liegt es endlich: das Kajak Ova, genau dort, wo der Dorfälteste es beschrieben hatte.',
      },
      {
        speaker: 'helix',
        emotion: 'panicked',
        text: 'Das soll uns unbemerkt über die Bucht bringen? Es hat Platz für eineinhalb Personen.',
      },
      {
        speaker: 'princess',
        emotion: 'smug',
        text: 'Dann atmen Sie eben flach. Auf zum Schiff, Helix.',
      },
    ],
  },

  'finale-step1-intro': {
    id: 'finale-step1-intro',
    trigger: 'interaction',
    once: true,
    hasPlayed: false,
    lines: [
      {
        speaker: 'helix',
        emotion: 'confused',
        text: 'Also gut. Leise rudern, nicht auffallen, so unauffällig wie möglich über offenes Wasser gleiten. Ganz meine Paradedisziplin.',
      },
      {
        speaker: 'princess',
        emotion: 'sarcastic',
        text: 'Ihre Paradedisziplin war bislang eher, Aufmerksamkeit zu erregen. Aber gerne, überraschen Sie mich.',
      },
      {
        speaker: 'narrator',
        text: 'Die Bucht liegt ruhig da. Das Schiff wartet, weit vorn, still im Wasser.',
      },
    ],
  },

  'finale-step1-outcome': {
    id: 'finale-step1-outcome',
    trigger: 'interaction',
    once: true,
    hasPlayed: false,
    lines: [
      {
        speaker: 'narrator',
        text: 'Paddelschlag für Paddelschlag gleiten sie im gleichmäßigen Takt über die Bucht – kein Platschen, kein Wortwechsel, nur das leise Tropfen der Ruder.',
      },
      {
        speaker: 'helix',
        emotion: 'smug',
        text: 'Sehen Sie? Reine Präzisionsarbeit.',
      },
      {
        speaker: 'princess',
        emotion: 'smug',
        text: 'Für einmal möchte ich nicht widersprechen.',
      },
      {
        speaker: 'narrator',
        text: 'Unbemerkt erreichen sie den Rumpf des Schiffs und klettern, so leise es eben geht, an Bord.',
      },
    ],
  },
  'finale-step1-fallback': {
    id: 'finale-step1-fallback',
    trigger: 'interaction',
    once: true,
    hasPlayed: false,
    lines: [
      {
        speaker: 'narrator',
        text: 'Der Rhythmus gerät aus dem Takt: Helix taucht das Paddel zu tief, Wasser klatscht, das Kajak schlingert bedenklich.',
      },
      {
        speaker: 'helix',
        emotion: 'panicked',
        text: 'Das war ein einkalkuliertes Nebengeräusch! Vollständig im Toleranzbereich!',
      },
      {
        speaker: 'princess',
        emotion: 'sarcastic',
        text: 'Der Toleranzbereich hat uns gerade beide nass gemacht, Helix.',
      },
      {
        speaker: 'narrator',
        text: 'Zum Glück regt sich in der Bucht niemand – entweder schläft alles, oder es hat sich längst an das Duo gewöhnt. Klatschend, aber unbehelligt erreichen sie das Schiff.',
      },
    ],
  },

  'finale-step2-intro': {
    id: 'finale-step2-intro',
    trigger: 'interaction',
    once: true,
    hasPlayed: false,
    lines: [
      {
        speaker: 'narrator',
        text: 'An Deck breitet Helix noch einmal alles aus: der Kompass, die Insel-Skizze, der geborgene Königsschatz.',
      },
      {
        speaker: 'helix',
        emotion: 'confused',
        text: 'Kompass, Karte, Schatz. Wir sind offiziell... vorbereitet? Das fühlt sich noch immer falsch an.',
      },
      {
        speaker: 'princess',
        emotion: 'sarcastic',
        text: 'Für uns beide erschreckend ungewöhnlich, ja.',
      },
      {
        speaker: 'narrator',
        text: 'Kompass und Skizze zeigen den einzig sicheren Weg aus der Bucht. Die von Bilone und Bidate angeheuerte Crew steht bereits auf ihren Posten.',
      },
      {
        speaker: 'narrator',
        text: 'Bidate nickt ihnen von der Reling zu. "Wird auch Zeit. Sagt Bescheid, und wir legen ab."',
      },
      {
        speaker: 'helix',
        emotion: 'triumphant',
        text: 'Ein letzter Handgriff, und wir sind weg von dieser verfluchten Insel.',
      },
      {
        speaker: 'princess',
        emotion: 'smug',
        text: 'Nach Ihnen, Kapitän Kisten. Ausnahmsweise.',
      },
    ],
  },

  'finale-step2-outcome': {
    id: 'finale-step2-outcome',
    trigger: 'interaction',
    once: true,
    hasPlayed: false,
    lines: [
      {
        speaker: 'narrator',
        text: 'Mit überraschender Koordination rasselt die Ankerkette hoch, die Segel fangen Wind, die angeheuerte Crew wirbelt geschäftig über Deck.',
      },
      {
        speaker: 'helix',
        emotion: 'triumphant',
        text: 'Wir schaffen es tatsächlich! Nach all dem – nach ALLEM – schaffen wir es tatsächlich.',
      },
      {
        speaker: 'princess',
        emotion: 'smug',
        text: 'Wer hätte gedacht, dass ausgerechnet Sie und ich das gemeinsam hinbekommen. Und dazu noch mit dem Königsschatz an Bord.',
      },
      {
        speaker: 'narrator',
        text: 'Die Insel wird kleiner hinter ihnen, die Sonne sinkt golden über dem Wasser. Affen, Höhle, Dorf, Tempelruine, Bucht – alles liegt hinter ihnen.',
      },
      {
        speaker: 'helix',
        emotion: 'confused',
        text: 'Wissen Sie, Eure Durchlaucht... das war fast schon unterhaltsam. Rein professionell betrachtet.',
      },
      {
        speaker: 'princess',
        emotion: 'sarcastic',
        text: 'Sagen Sie das nicht zu laut, Helix. Sonst müssen wir es noch einmal tun.',
      },
      {
        speaker: 'narrator',
        text: 'Der Königsschatz kehrt heim, wohin er gehört – und mit ihm zwei sehr unwahrscheinliche Verbündete. Ende des Prototyps – für jetzt.',
      },
    ],
  },
  'finale-step2-fallback': {
    id: 'finale-step2-fallback',
    trigger: 'interaction',
    once: true,
    hasPlayed: false,
    lines: [
      {
        speaker: 'narrator',
        text: 'Die Ankerkette verhakt sich auf halbem Weg. Helix zieht mit aller Kraft, ächzend und schwitzend, während die Crew halb amüsiert, halb besorgt zusieht.',
      },
      {
        speaker: 'helix',
        emotion: 'panicked',
        text: 'Das Ding will einfach nicht... warum will es NICHT-',
      },
      {
        speaker: 'princess',
        emotion: 'sarcastic',
        text: 'Vielleicht, weil Sie es seit einer Minute in die falsche Richtung ziehen.',
      },
      {
        speaker: 'narrator',
        text: 'Mit einem letzten, wenig würdevollen Ruck reißt sich der Anker los, eher durch Sturheit als durch Geschick – und das Schiff schlingert hinaus aufs offene Wasser.',
      },
      {
        speaker: 'helix',
        emotion: 'triumphant',
        text: 'Siehst du? Hat doch geklappt!',
      },
      {
        speaker: 'princess',
        emotion: 'sarcastic',
        text: 'Wenn man "geklappt" mit "wir haben überlebt" verwechselt, ja.',
      },
      {
        speaker: 'narrator',
        text: 'Die Insel wird kleiner hinter ihnen, die Sonne sinkt golden über dem Wasser. Nicht elegant, aber sie sind draußen – mit dem Königsschatz an Bord.',
      },
      {
        speaker: 'narrator',
        text: 'Ende des Prototyps – für jetzt. Irgendwo da draußen warten sicher schon neue, gänzlich unfreiwillige Abenteuer.',
      },
    ],
  },

  'lost-treasure-intro': {
    id: 'lost-treasure-intro',
    trigger: 'interaction',
    once: true,
    hasPlayed: false,
    lines: [
      {
        speaker: 'narrator',
        text: 'Kompass, Insel-Skizze und der Hinweis aus dem Dorf zeigen, zum ersten Mal seit der Strandung, alle auf denselben Punkt: eine von Ranken überwucherte Ruine, tief im Inselinneren.',
      },
      {
        speaker: 'helix',
        emotion: 'smug',
        text: 'Sehen Sie? Genau dafür hat man mich früher gut bezahlt. Oder gesucht. Eins von beidem.',
      },
      {
        speaker: 'princess',
        emotion: 'sarcastic',
        text: 'Sie meinen, wir sind dem Zufall gefolgt und hatten Glück.',
      },
      {
        speaker: 'narrator',
        text: 'Zwischen geborstenen Steinquadern liegt ein Eingang frei – versperrt von einem massiven, mit Symbolen verzierten Steinmechanismus.',
      },
      {
        speaker: 'helix',
        emotion: 'panicked',
        text: 'Das sieht nach der Sorte Falle aus, über die man in Legenden immer erst HINTERHER etwas liest.',
      },
      {
        speaker: 'princess',
        emotion: 'sarcastic',
        text: 'Das sieht nach einer Tür aus, Helix.',
      },
      {
        speaker: 'narrator',
        text: 'Dahinter, davon sind beide plötzlich fest überzeugt, liegt der Königsschatz – der eigentliche Grund für diese ganze unglückselige Reise.',
      },
    ],
  },

  'lost-treasure-step1-intro': {
    id: 'lost-treasure-step1-intro',
    trigger: 'interaction',
    once: true,
    hasPlayed: false,
    lines: [
      {
        speaker: 'helix',
        emotion: 'confused',
        text: 'Optionen: Wir knacken den Mechanismus, oder wir brechen ihn mit roher Gewalt auf.',
      },
      {
        speaker: 'princess',
        emotion: 'smug',
        text: 'Nach allem, was wir bisher überlebt haben, würde ich fast zu Ersterem raten.',
      },
      {
        speaker: 'helix',
        emotion: 'annoyed',
        text: 'Ich neige eher zu Option zwei. Klügere Männer als ich sind an Türen wie dieser gescheitert – aber die hatten auch nicht meine Oberarme.',
      },
      {
        speaker: 'narrator',
        text: 'Der Mechanismus wartet, unbeeindruckt von jeder Selbsteinschätzung, geduldig auf eine Entscheidung.',
      },
    ],
  },

  'lost-treasure-outcome-logic': {
    id: 'lost-treasure-outcome-logic',
    trigger: 'interaction',
    once: true,
    hasPlayed: false,
    lines: [
      {
        speaker: 'narrator',
        text: 'Laja studiert die eingemeißelten Symbole, erkennt das Muster darin und drückt sie in ruhiger, exakter Reihenfolge.',
      },
      {
        speaker: 'princess',
        emotion: 'smug',
        text: 'Sehen Sie, Helix? Manchmal braucht es kein Schwert. Nur Beobachtungsgabe.',
      },
      {
        speaker: 'narrator',
        text: 'Mit einem tiefen, jahrhundertealten Knirschen gleitet der Steinmechanismus zur Seite.',
      },
      {
        speaker: 'helix',
        emotion: 'confused',
        text: 'Das hätte ich auch gekonnt. Theoretisch. Mit mehr Vorbereitungszeit. Und vielleicht einer Brille.',
      },
      {
        speaker: 'narrator',
        text: 'Im Inneren der Kammer, auf einem einzelnen Sockel, liegt er endlich: der Königsschatz.',
      },
    ],
  },
  'lost-treasure-fallback-logic': {
    id: 'lost-treasure-fallback-logic',
    trigger: 'interaction',
    once: true,
    hasPlayed: false,
    lines: [
      {
        speaker: 'narrator',
        text: 'Helix versucht sich an den Symbolen, drückt sie aber in einer Reihenfolge, die eher seiner Laune als irgendeiner Logik folgt.',
      },
      {
        speaker: 'helix',
        emotion: 'panicked',
        text: 'Jeder Fehlversuch bringt uns näher an den richtigen! Das ist... Abenteurer-Mathematik!',
      },
      {
        speaker: 'princess',
        emotion: 'sarcastic',
        text: 'Diese Mathematik existiert nicht, Helix.',
      },
      {
        speaker: 'narrator',
        text: 'Nach etlichen falschen Kombinationen löst sich der Mechanismus dennoch – vermutlich eher aus Erschöpfung als aus Überzeugung – und gibt den Weg frei.',
      },
      {
        speaker: 'narrator',
        text: 'Im Inneren der Kammer, auf einem einzelnen Sockel, liegt er: der Königsschatz.',
      },
    ],
  },

  'lost-treasure-outcome-lever': {
    id: 'lost-treasure-outcome-lever',
    trigger: 'interaction',
    once: true,
    hasPlayed: false,
    lines: [
      {
        speaker: 'narrator',
        text: 'Helix stemmt sich mit vollem Gewicht gegen den steinernen Hebel, das Gesicht zu einer Grimasse verzogen, die er selbst vermutlich für heldenhaft hält.',
      },
      {
        speaker: 'helix',
        emotion: 'smug',
        text: 'Das ist reine... rohe... GEWALT! Genau meine Spezialität!',
      },
      {
        speaker: 'narrator',
        text: 'Mit einem gewaltigen Ruck gibt der uralte Mechanismus nach und der Steinblock gleitet zur Seite.',
      },
      {
        speaker: 'princess',
        emotion: 'confused',
        text: 'Nun. Unelegant, aber – zu meiner eigenen Überraschung – wirkungsvoll.',
      },
      {
        speaker: 'narrator',
        text: 'Im Inneren der Kammer, auf einem einzelnen Sockel, liegt er endlich: der Königsschatz.',
      },
    ],
  },
  'lost-treasure-fallback-lever': {
    id: 'lost-treasure-fallback-lever',
    trigger: 'interaction',
    once: true,
    hasPlayed: false,
    lines: [
      {
        speaker: 'narrator',
        text: 'Laja versucht sich, mit deutlich weniger Körperkraft, an Helix\' Methode und stemmt sich gegen den Hebel – ohne sichtbaren Erfolg.',
      },
      {
        speaker: 'princess',
        emotion: 'panicked',
        text: 'Der bewegt sich nicht. Der bewegt sich definitiv nicht.',
      },
      {
        speaker: 'helix',
        emotion: 'sarcastic',
        text: 'Vielleicht fehlt da etwas... Ich sag jetzt nicht "Muskeln". Aber ich denke es sehr laut.',
      },
      {
        speaker: 'narrator',
        text: 'Erst als beide gemeinsam, mehr aus Verzweiflung als aus Plan, dagegendrücken, gibt der Stein knirschend nach.',
      },
      {
        speaker: 'narrator',
        text: 'Im Inneren der Kammer, auf einem einzelnen Sockel, liegt er: der Königsschatz.',
      },
    ],
  },

  'mountain-viewpoint': {
    id: 'mountain-viewpoint',
    trigger: 'interaction',
    once: true,
    hasPlayed: false,
    lines: [
      { speaker: 'narrator', text: 'Von hier oben liegt fast die ganze Insel zu Füßen.' },
      { speaker: 'princess', emotion: 'triumphant', text: 'Ah, sieh an. Von oben betrachtet wirkt selbst diese Katastrophe fast pittoresk.' },
      { speaker: 'helix', emotion: 'panicked', text: 'Bitte nicht so nah an den Rand, ich habe schon genug Herzinfarkte für heute gehabt.' },
    ],
  },
};
