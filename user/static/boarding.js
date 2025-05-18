document.addEventListener("DOMContentLoaded", function() {
    // Banned words (same list, without escaping)
    const bannedWordsRaw = [
        // Offensive language (English/Swedish + leetspeak) — from before
        "fuck", "fuk", "fukc", "f*ck", "f@ck", "f4ck",
        "shit", "sh1t", "sh!t", "sht",
        "bitch", "biatch", "b1tch", "b!tch",
        "asshole", "a**hole", "a55hole", "arsehole",
        "cunt", "cnt", "c*nt", "c@nt",
        "faggot", "f4ggot", "f@ggot", "faqqot", "fagot", "fgt",
        "nigger", "n1gger", "n!gger", "nigga", "niga", "ni99er", "ni**er",
        "slut", "s1ut", "slvt", "s!ut",
        "whore", "wore", "h0e", "hoe", "h*e",
        "retard", "r3tard", "re*ard", "idiot", "dumb", "stupid", "moron",
    
        // Swedish
        "hora", "h0ra", "h*ra",
        "fitta", "f1tta", "f!tta", "f*tta",
        "kuk", "k*k", "kux", "kukk",
        "jävla", "javla", "jävel", "javel", "jäfla",
        "satan", "satans",
        "cp", "mongo", "m0ngo",
        "bög", "boeg", "b0g", "b!g", "bögjävel", "bögfan",
        "neger", "n3ger", "n!ger",
        "äckel", "ackel", "äcklig", "äckliga",
        "idiot", "idioter", "dum", "dummer", "pucko",
    
        // Historical / Controversial figures (add more as needed)
        "hitler", "h1tler", "hitla", "hitlaa",
        "stalin", "st4lin", "st4l1n",
        "mussolini", "musolini", "muss0lini",
        "binladen", "bin_laden", "osama", "0sama",
        "alqaeda", "alqaida", "al_qaida", "al_qaeda",
        "isis", "1sis", "is1s", "isls",
        "polpot", "pol_pot",
        "saddam", "saddam hussein", "sadd4m",
        "kony", "josephkony", "konny",
        "mao", "maozedong", "zedong",
        "putin", "pvtin", "putler",
        "hitla", "nazi", "naz1", "n4zi", "n@zi",
        "heil", "3rdreich", "reich", "führer", "fuhrer",
        "kkk", "klan", "grandwizard"
    ];

    // Escape special regex characters
    function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    // Normalize to lowercase, handle leetspeak
    const leetVariants = {
        '0': 'o',
        '1': 'i',
        '!': 'i',
        '@': 'a',
        '3': 'e',
        '4': 'a',
        '5': 's',
        '$': 's',
        '7': 't'
    };

    function normalizeInput(input) {
        return input.toLowerCase().split('').map(char =>
            leetVariants[char] || char
        ).join('');
    }

    // Create a regex from escaped words
    const bannedRegex = new RegExp(bannedWordsRaw.map(escapeRegExp).join("|"), "i");

    document.getElementById("usernameForm").addEventListener("submit", function(e) {
        const inputField = document.getElementById("usernameInput");
        const rawInput = inputField.value;
        const normalized = normalizeInput(rawInput);

        if (bannedRegex.test(normalized)) {
            e.preventDefault();
            inputField.value = ""; // Clear input silently
            inputField.blur();
            setTimeout(() => inputField.focus(), 50);
        }
    });
});
