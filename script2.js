// --- Google Maps Place Autocomplete Functions (Global Scope) ---
function getCountry(place) {
    if (!place.addressComponents) return null;
    const countryComponent = place.addressComponents.find(c => c.types.includes('country'));
    return countryComponent ? countryComponent.longText : null;
}

// This function will be called by the Google Maps API callback when it's ready
async function initAutocomplete() {
    // Ensure the custom element is defined before trying to create it
    await customElements.whenDefined('gmp-place-autocomplete');

    const departureAddressInput = document.getElementById('departure-address');
    const destinationAddressInput = document.getElementById('destination-address');
    
    const departureCountrySelect = document.getElementById('departure-country');
    const destinationCountrySelect = document.getElementById('destination-country');

    if (!departureAddressInput || !destinationAddressInput || !departureCountrySelect || !destinationCountrySelect) {
        console.error("Could not find all required input/select elements for autocomplete.");
        return;
    }

    // --- Departure Autocomplete ---
    const departureAutocomplete = new google.maps.places.PlaceAutocompleteElement();
    departureAutocomplete.inputElement = departureAddressInput;
    departureAutocomplete.addEventListener('gmp-placeselect', (event) => {
        const place = event.place;
        console.log('Departure Place selected:', place);
        
        const countryName = getCountry(place);
        if (countryName) {
            // Find the option with the matching English name (value) and select it
            for (let i = 0; i < departureCountrySelect.options.length; i++) {
                if (departureCountrySelect.options[i].value === countryName) {
                    departureCountrySelect.selectedIndex = i;
                    break;
                }
            }
        }
    });

    // --- Destination Autocomplete ---
    const destinationAutocomplete = new google.maps.places.PlaceAutocompleteElement();
    destinationAutocomplete.inputElement = destinationAddressInput;
    destinationAutocomplete.addEventListener('gmp-placeselect', (event) => {
        const place = event.place;
        console.log('Destination Place selected:', place);
        
        const countryName = getCountry(place);
        if (countryName) {
             // Find the option with the matching English name (value) and select it
            for (let i = 0; i < destinationCountrySelect.options.length; i++) {
                if (destinationCountrySelect.options[i].value === countryName) {
                    destinationCountrySelect.selectedIndex = i;
                    break;
                }
            }
        }
    });
}


document.addEventListener('DOMContentLoaded', () => {
    // --- Translations Object ---
    const translations = {
        'fr': {
            title: "Formulaire de Transport d'Animaux",
            page1_title: "Informations sur l'Animal",
            page2_title: "Départ et Destination",
            page3_title: "Conditions de Voyage",
            departure_title: "Départ",
            destination_title: "Destination",
            departure_address_label: "Adresse:",
            departure_country_label: "Pays:",
            destination_address_label: "Adresse:",
            destination_country_label: "Pays:",
            select_country_option: "--Sélectionner un Pays--",
            departure_date_label: "Date de départ proposée:",
            date_option_1: "Dans 1 mois",
            date_option_2: "Dans 1 à 3 mois",
            date_option_3: "Au-delà de 3 mois",
            date_option_4: "Projet en cours de réflexion",
            travel_option_label: "Souhaitez-vous que l'animal voyage:",
            travel_option_alone: "Seul (Fret Aérien)",
            travel_option_cabin: "Avec vous - en cabine",
            travel_option_hold: "Avec vous - en soute",
            context_label: "Contexte:",
            context_breeding: "Transport pour reproduction",
            context_mobility: "Mobilité internationale / expatriation",
            context_joining: "Rejoindre le propriétaire à destination",
            context_others: "Autres",
            other_means_label: "Veuillez mentionner d'autres moyens:",
            additional_info_label: "Informations Supplémentaires:",
            add_pet_btn: "Ajouter un Animal",
            next_btn: "Suivant",
            prev_btn: "Précédent",
            submit_btn: "Soumettre",
            pet_heading: "Animal",
            remove_pet_btn: "Supprimer l'Animal",
            animal_type_label: "Type d'Animal:",
            breed_label: "Race:",
            other_animal_label: "Spécifiez Type d'Animal & Race:",
            age_label: "Âge:",
            weight_label: "Poids:",
            choose_animal_type: "--Veuillez choisir une option--",
            select_breed: "--Sélectionner Race--",
            error_alert: "Veuillez remplir tous les champs obligatoires.",
            submit_success: "Demande soumise avec succès!",
            submit_failure: "La soumission a échoué: ",
            sending: "Envoi en cours...",
            lang_toggle_text: "English"
        },
        'en': {
            title: "Pet Transport Form",
            page1_title: "Pet Information",
            page2_title: "Departure and Destination",
            page3_title: "Travel Conditions",
            departure_title: "Departure",
            destination_title: "Destination",
            departure_address_label: "Address:",
            departure_country_label: "Country:",
            destination_address_label: "Address:",
            destination_country_label: "Country:",
            select_country_option: "--Select a Country--",
            departure_date_label: "Proposed departure date:",
            date_option_1: "Within 1 month",
            date_option_2: "In 1 to 3 months",
            date_option_3: "Beyond 3 months",
            date_option_4: "Project under consideration",
            travel_option_label: "Do you want the pet to travel:",
            travel_option_alone: "Alone (Air Freight)",
            travel_option_cabin: "With you - in cabin",
            travel_option_hold: "With you - in hold",
            context_label: "Context:",
            context_breeding: "Transport for breeding",
            context_mobility: "International mobility/expatriation",
            context_joining: "Joining the owner at the destination",
            context_others: "Others",
            other_means_label: "Please mention other means:",
            additional_info_label: "Additional Information:",
            add_pet_btn: "Add Pet",
            next_btn: "Next",
            prev_btn: "Previous",
            submit_btn: "Submit",
            pet_heading: "Pet",
            remove_pet_btn: "Remove Pet",
            animal_type_label: "Animal Type:",
            breed_label: "Breed:",
            other_animal_label: "Specify Animal Type & Breed:",
            age_label: "Age:",
            weight_label: "Weight:",
            choose_animal_type: "--Please choose an option--",
            select_breed: "--Select Breed--",
            error_alert: "Please fill in all required fields.",
            submit_success: "Request submitted successfully!",
            submit_failure: "Submission failed: ",
            sending: "Sending...",
            lang_toggle_text: "Français"
        }
    };

    let currentLang = 'fr'; // Start in French

    // --- Translation Maps (English Value -> French Display Text) ---
    const animalTypeMap_fr = {
        'Cat': 'Chat',
        'Dog': 'Chien',
        'Bird': 'Oiseau',
        'Rabbit': 'Lapin',
        'NAC': 'NAC (Nouveaux Animaux de Compagnie)',
        'Others': 'Autres'
    };

    // Full Breed Map (English Value -> French Display Text)
    const breedsMap_fr = {
        "Abyssinian": "Abyssin", "American Bobtail": "Bobtail Américain", "American Curl": "American Curl", "American Shorthair": "American Shorthair", "American Wirehair": "American Wirehair", "Asian": "Asiatique", "Australian Mist": "Australian Mist", "Balinese": "Balinais", "Bengal": "Bengal", "Birman (Sacred Birman)": "Sacré de Birmanie", "Bohemian Rex": "Rex de Bohême", "Bombay": "Bombay", "British Longhair": "Britannique à Poil Long", "British Shorthair": "Britannique à Poil Court", "Burmese": "Burmese", "Burmilla": "Burmilla", "Californian Rex": "Rex Californien", "Chartreux": "Chartreux", "Cornish Rex": "Cornish Rex", "Cymric": "Cymric", "Devon Rex": "Devon Rex", "Domestic Cat": "Chat Domestique", "Donskoy (Don Sphynx)": "Donskoy (Sphynx du Don)", "Egyptian Mau": "Mau Égyptien", "European": "Européen", "Exotic Fold": "Exotic Fold", "Exotic Shorthair": "Exotic Shorthair", "German Rex": "Rex Allemand", "Highland Fold": "Highland Fold", "Himalayan": "Himalayen", "Japanese Bobtail": "Bobtail Japonais", "Korat": "Korat", "Kurilian Bobtail": "Bobtail des Kouriles", "LaPerm": "LaPerm", "Lykoi": "Lykoï", "Maine Coon": "Maine Coon", "Manx": "Manx", "Mekong Bobtail": "Bobtail du Mékong", "Munchkin": "Munchkin", "Nebelung": "Nebelung", "Neva Masquerade": "Neva Mascarade", "Norwegian Forest Cat": "Norvégien", "Ocicat": "Ocicat", "Oriental": "Oriental", "Persian": "Persan", "Peterbald": "Peterbald", "Ragamuffin": "Ragamuffin", "Ragdoll": "Ragdoll", "Russian Blue": "Bleu Russe", "Savannah": "Savannah", "Scottish Fold": "Scottish Fold", "Selkirk Rex": "Selkirk Rex", "Siamese": "Siamois", "Siberian": "Sibérien", "Singapura": "Singapura", "Snowshoe": "Snowshoe", "Sokoke": "Sokoke", "Somali": "Somali", "Sphynx": "Sphynx", "Thai": "Thaï", "Tiffanie": "Tiffanie", "Tonkinese": "Tonkinois", "Toyger": "Toyger", "Turkish Angora": "Angora Turc", "Turkish Van": "Turc de Van",
        "Affenpinscher": "Affenpinscher", "Airedale Terrier": "Airedale Terrier", "Akita Inu": "Akita Inu", "Alaskan Klee Kai": "Alaskan Klee Kai", "Alaskan Malamute": "Malamute de l'Alaska", "American Akita": "Akita Américain", "American Bully": "American Bully", "American Pit Bull Terrier": "American Pit Bull Terrier", "American Staffordshire Terrier": "American Staffordshire Terrier", "Anatolian Shepherd": "Berger d'Anatolie", "Appenzeller Sennenhund": "Bouvier d'Appenzell", "Atlas Shepherd (Aidi)": "Aïdi (Berger de l'Atlas)", "Australian Cattle Dog": "Australian Cattle Dog", "Australian Shepherd": "Berger Australien", "Australian Terrier": "Australian Terrier", "Basenji": "Basenji", "Basset Hound": "Basset Hound", "Bearded Collie": "Colley Barbu", "Beauceron": "Beauceron", "Belgian Malinois": "Malinois", "Belgian Shepherd": "Berger Belge", "Bernese Mountain Dog": "Bouvier Bernois", "Bichon Frise": "Bichon Frisé", "Bloodhound": "Chien de Saint-Hubert", "Boerboel": "Boerboel", "Border Collie": "Border Collie", "Border Terrier": "Border Terrier", "Borzoi": "Barzoï", "Boston Terrier": "Boston Terrier", "Bouvier des Ardennes": "Bouvier des Ardennes", "Bouvier des Flandres": "Bouvier des Flandres", "Boxer": "Boxer", "Briard": "Berger de Brie", "Brittany Spaniel": "Épagneul Breton", "Broholmer": "Broholmer", "Brussels Griffon": "Griffon Bruxellois", "Bull Terrier": "Bull Terrier", "Bullmastiff": "Bullmastiff", "Ca de Bou (Majorcan Mastiff)": "Ca de Bou (Dogue de Majorque)", "Cairn Terrier": "Cairn Terrier", "Cane Corso": "Cane Corso", "Catalan Sheepdog": "Berger Catalan", "Caucasian Shepherd Dog": "Berger du Caucase", "Cavalier King Charles Spaniel": "Cavalier King Charles Spaniel", "Chihuahua": "Chihuahua", "Chow Chow": "Chow Chow", "Cocker Spaniel": "Cocker Spaniel", "Collie": "Colley", "Coton de Tulear": "Coton de Tuléar", "Czechoslovakian Wolfdog": "Chien-loup Tchécoslovaque", "Dachshund": "Teckel", "Dalmatian": "Dalmatien", "Doberman": "Doberman", "Dogo Argentino": "Dogue Argentin", "Dogue de Bordeaux": "Dogue de Bordeaux", "Dutch Smoushond (Kooikerhondje)": "Smoushond Hollandais (Kooikerhondje)", "English Bulldog": "Bulldog Anglais", "English Pointer": "Pointer Anglais", "Fila Brasileiro": "Fila Brasileiro", "Finnish Spitz": "Spitz Finlandais", "Fox Terrier": "Fox Terrier", "French Bulldog": "Bouledogue Français", "German Shepherd": "Berger Allemand", "German Spitz": "Spitz Allemand", "Golden Retriever": "Golden Retriever", "Great Dane": "Dogue Allemand", "Greater Swiss Mountain Dog": "Grand Bouvier Suisse", "Greyhound": "Lévrier", "Icelandic Sheepdog": "Berger d'Islande", "Italian Greyhound": "Petit Lévrier Italien", "Italian Spitz": "Spitz Italien", "Jack Russell Terrier": "Jack Russell Terrier", "Japanese Spaniel (Japanese Chin)": "Épagneul Japonais (Chin)", "Japanese Spitz": "Spitz Japonais", "Japanese Terrier": "Terrier Japonais", "King Charles Spaniel": "King Charles Spaniel", "Komondor": "Komondor", "Labrador Retriever": "Labrador Retriever", "Leonberger": "Leonberger", "Lhasa Apso": "Lhassa Apso", "Maltese": "Maltais", "Mastiff": "Mastiff", "Neapolitan Mastiff": "Mâtin de Naples", "Newfoundland": "Terre-Neuve", "Norfolk Terrier": "Terrier de Norfolk", "Old English Sheepdog (Bobtail)": "Bobtail", "Pekingese": "Pékinois", "Picardy Shepherd": "Berger Picard", "Pinscher": "Pinscher", "Pointer": "Pointer", "Polish Lowland Sheepdog": "Berger Polonais de Plaine", "Pomeranian": "Spitz Nain (Loulou de Poméranie)", "Poodle": "Caniche", "Portuguese Water Dog": "Chien d'Eau Portugais", "Pug": "Carlin", "Puli/Pumi/Mudi": "Puli/Pumi/Mudi", "Pyrenean Mastiff": "Mâtin des Pyrénées", "Pyrenean Mountain Dog": "Montagne des Pyrénées", "Pyrenean Shepherd": "Berger des Pyrénées", "Rhodesian Ridgeback": "Rhodesian Ridgeback", "Rottweiler": "Rottweiler", "Saint Bernard": "Saint-Bernard", "Saluki": "Saluki", "Samoyed": "Samoyède", "Schnauzer": "Schnauzer", "Scottish Terrier": "Terrier Écossais", "Setter": "Setter", "Shar Pei": "Shar Pei", "Shetland Sheepdog": "Berger des Shetland", "Shiba Inu": "Shiba Inu", "Shih Tzu": "Shih Tzu", "Siberian Husky": "Husky Sibérien", "Skye Terrier": "Skye Terrier", "Staffordshire Bull Terrier": "Staffordshire Bull Terrier", "Standard Poodle": "Caniche Standard", "Swiss White Shepherd": "Berger Blanc Suisse", "Tervuren Shepherd": "Tervuren", "Tibetan Mastiff": "Dogue du Tibet", "Tibetan Spaniel": "Épagneul du Tibet", "Tibetan Terrier": "Terrier du Tibet", "Tosa": "Tosa", "Weimaraner": "Braque de Weimar", "Welsh Corgi": "Corgi", "Welsh Terrier": "Terrier Gallois", "West Highland White Terrier": "West Highland White Terrier (Westie)", "Whippet": "Whippet", "Yorkshire Terrier": "Yorkshire Terrier", "Others": "Autres",
        "Chinchilla": "Chinchilla", "Guinea Pig": "Cochon d'Inde", "Ferret": "Furet", "Gecko": "Gecko", "Lizard": "Lézard", "Salamander": "Salamandre", "Domestic Rat": "Rat Domestique", "Snake": "Serpent", "Turtle": "Tortue",
        "Ara": "Ara", "Cockatoo": "Cacatoès", "Caique": "Caïque", "Canary": "Canari", "Conure": "Conure", "Eclectus": "Éclectus", "African Grey": "Gris du Gabon", "Lory": "Lori", "Lovebird": "Inséparable", "Ring-necked Parakeet": "Perruche à Collier", "Budgerigar": "Perruche Ondulée", "Amazon Parrot": "Perroquet Amazonien",
        "Holland Lop (lop-eared dwarf)": "Lapin Nain Bélier", "Netherland Dwarf": "Lapin Nain de Couleur", "Angora Dwarf (long-haired)": "Lapin Angora Nain", "Lionhead Rabbit (mane around the head)": "Lapin Tête de Lion", "Dutch Rabbit": "Lapin Hollandais", "Burgundy Fawn": "Fauve de Bourgogne", "Norman": "Normand", "English Butterfly": "Papillon Anglais", "Flemish Giant": "Géant des Flandres", "White Giant Rabbit from Bouscat": "Géant Blanc du Bouscat",
        "Others": "Autres"
    };
    
    // Country Map (English Value -> French Display Text)
    const countryMap_fr = {
        "Afghanistan": "Afghanistan", "Albania": "Albanie", "Algeria": "Algérie", "Andorra": "Andorre", "Angola": "Angola", "Antigua and Barbuda": "Antigua-et-Barbuda", "Argentina": "Argentine", "Armenia": "Arménie", "Australia": "Australie", "Austria": "Autriche", "Azerbaijan": "Azerbaïdjan", "Bahamas": "Bahamas", "Bahrain": "Bahreïn", "Bangladesh": "Bangladesh", "Barbados": "Barbade", "Belarus": "Bélarus", "Belgium": "Belgique", "Belize": "Belize", "Benin": "Bénin", "Bhutan": "Bhoutan", "Bolivia": "Bolivie", "Bosnia and Herzegovina": "Bosnie-Herzégovine", "Botswana": "Botswana", "Brazil": "Brésil", "Brunei": "Brunei", "Bulgaria": "Bulgarie", "Burkina Faso": "Burkina Faso", "Burundi": "Burundi", "Cabo Verde": "Cabo Verde", "Cambodia": "Cambodge", "Cameroon": "Cameroun", "Canada": "Canada", "Central African Republic": "République centrafricaine", "Chad": "Tchad", "Chile": "Chili", "China": "Chine", "Colombia": "Colombie", "Comoros": "Comores", "Costa Rica": "Costa Rica", "Croatia": "Croatie", "Cuba": "Cuba", "Cyprus": "Chypre", "Czech Republic": "République Tchèque", "Democratic Republic of the Congo": "République démocratique du Congo", "Denmark": "Danemark", "Djibouti": "Djibouti", "Dominica": "Dominique", "Dominican Republic": "République Dominicaine", "Ecuador": "Équateur", "Egypt": "Égypte", "El Salvador": "El Salvador", "Equatorial Guinea": "Guinée équatoriale", "Eritrea": "Érythrée", "Estonia": "Estonie", "Eswatini": "Eswatini", "Ethiopia": "Éthiopie", "Fiji": "Fidji", "Finland": "Finlande", "France": "France", "Gabon": "Gabon", "Gambia": "Gambie", "Georgia": "Géorgie", "Germany": "Allemagne", "Ghana": "Ghana", "Greece": "Grèce", "Grenada": "Grenade", "Guatemala": "Guatemala", "Guinea": "Guinée", "Guinea-Bissau": "Guinée-Bissau", "Guyana": "Guyana", "Haiti": "Haïti", "Honduras": "Honduras", "Hungary": "Hongrie", "Iceland": "Islande", "India": "Inde", "Indonesia": "Indonésie", "Iran": "Iran", "Iraq": "Irak", "Ireland": "Irlande", "Israel": "Israël", "Italy": "Italie", "Ivory Coast": "Côte d'Ivoire", "Jamaica": "Jamaïque", "Japan": "Japon", "Jordan": "Jordanie", "Kazakhstan": "Kazakhstan", "Kenya": "Kenya", "Kiribati": "Kiribati", "Kosovo": "Kosovo", "Kuwait": "Koweït", "Kyrgyzstan": "Kirghizistan", "Laos": "Laos", "Latvia": "Lettonie", "Lebanon": "Liban", "Lesotho": "Lesotho", "Liberia": "Libéria", "Libya": "Libye", "Liechtenstein": "Liechtenstein", "Lithuania": "Lituanie", "Luxembourg": "Luxembourg", "Madagascar": "Madagascar", "Malawi": "Malawi", "Malaysia": "Malaisie", "Maldives": "Maldives", "Mali": "Mali", "Malta": "Malte", "Marshall Islands": "Îles Marshall", "Mauritania": "Mauritanie", "Mauritius": "Maurice", "Mexico": "Mexique", "Micronesia": "Micronésie", "Moldova": "Moldavie", "Monaco": "Monaco", "Mongolia": "Mongolie", "Montenegro": "Monténégro", "Morocco": "Maroc", "Mozambique": "Mozambique", "Myanmar": "Myanmar", "Namibia": "Namibie", "Nauru": "Nauru", "Nepal": "Népal", "Netherlands": "Pays-Bas", "New Zealand": "Nouvelle-Zélande", "Nicaragua": "Nicaragua", "Niger": "Niger", "Nigeria": "Nigéria", "North Korea": "Corée du Nord", "North Macedonia": "Macédoine du Nord", "Norway": "Norvège", "Oman": "Oman", "Pakistan": "Pakistan", "Palau": "Palaos", "Panama": "Panama", "Papua New Guinea": "Papouasie-Nouvelle-Guinée", "Paraguay": "Paraguay", "Peru": "Pérou", "Philippines": "Philippines", "Poland": "Pologne", "Portugal": "Portugal", "Qatar": "Qatar", "Republic of the Congo": "République du Congo", "Romania": "Roumanie", "Russia": "Russie", "Rwanda": "Rwanda", "Saint Kitts and Nevis": "Saint-Kitts-et-Nevis", "Saint Lucia": "Sainte-Lucie", "Saint Vincent and the Grenadines": "Saint-Vincent-et-les Grenadines", "Samoa": "Samoa", "San Marino": "Saint-Marin", "Sao Tome and Principe": "Sao Tomé-et-Principe", "Saudi Arabia": "Arabie Saoudite", "Sierra Leone": "Sierra Leone", "Singapore": "Singapour", "Slovakia": "Slovaquie", "Slovenia": "Slovénie", "Solomon Islands": "Îles Salomon", "Somalia": "Somalie", "South Africa": "Afrique du Sud", "South Korea": "Corée du Sud", "South Sudan": "Soudan du Sud", "Spain": "Espagne", "Sri Lanka": "Sri Lanka", "Sudan": "Soudan", "Suriname": "Suriname", "Sweden": "Suède", "Switzerland": "Suisse", "Syria": "Syrie", "Tajikistan": "Tadjikistan", "Tanzania": "Tanzanie", "Thailand": "Thaïlande", "Timor-Leste": "Timor-Leste", "Togo": "Togo", "Tonga": "Tonga", "Trinidad and Tobago": "Trinité-et-Tobago", "Tunisia": "Tunisie", "Turkey": "Turquie", "Turkmenistan": "Turkménistan", "Tuvalu": "Tuvalu", "Uganda": "Ouganda", "Ukraine": "Ukraine", "United Arab Emirates": "Émirats arabes unis", "United Kingdom": "Royaume-Uni", "United States of America": "États-Unis", "Uruguay": "Uruguay", "Uzbekistan": "Ouzbékistan", "Vanuatu": "Vanuatu", "Vatican City": "Cité du Vatican", "Venezuela": "Venezuela", "Vietnam": "Vietnam", "Yemen": "Yémen", "Zambia": "Zambie", "Zimbabwe": "Zimbabwe"
    };

    // --- Data Lists (Standard English names, used for internal 'value' and logic) ---
    const qualifiedDogs = [
        "Affenpinscher", "American Akita", "Akita Inu", "American Bully", "American Staffordshire Terrier", "Beauceron", "Anatolian Shepherd", "Caucasian Shepherd Dog",
        "Old English Sheepdog (Bobtail)", "Boerboel", "Boston Terrier", "English Bulldog", "French Bulldog", "Bernese Mountain Dog", "Bouvier des Flandres", "Bouvier des Ardennes",
        "Boxer", "Broholmer", "Bull Terrier", "Bullmastiff", "Ca de Bou (Majorcan Mastiff)", "Cane Corso", "Pug", "Cavalier King Charles Spaniel",
        "Pyrenean Mountain Dog", "Portuguese Water Dog", "Czechoslovakian Wolfdog", "Bloodhound", "Chihuahua", "Chow Chow", "Dogue de Bordeaux", "Doberman",
        "Dogo Argentino", "Dogo Canario (Presa Canario)", "Great Dane", "Japanese Spaniel (Japanese Chin)", "King Charles Spaniel", "Tibetan Spaniel", "Brussels Griffon", "Komondor",
        "Leonberger", "Lhasa Apso", "Tibetan Mastiff", "Pyrenean Mastiff", "Spanish Mastiff", "Neapolitan Mastiff", "Mastiff", "Pekingese", "Petit Brabançon",
        "Rottweiler", "Saint Bernard", "Shar Pei", "Shih Tzu", "Staffordshire Bull Terrier", "Newfoundland", "Tosa", "Fila Brasileiro"
    ];

    const qualifiedCats = [
        "Bengal", "British Longhair", "British Shorthair", "Burmese", "Exotic Fold", "Exotic Shorthair", "Himalayan", "Persian", "Savannah", "Scottish Fold", "Selkirk Rex"
    ];

    const nacBreeds = [
        "Chinchilla", "Guinea Pig", "Ferret", "Gecko", "Lizard", "Salamander", "Domestic Rat", "Snake", "Turtle", "Others"
    ];

    const qualifiedCountries = [
        "France", "Mauritius", "Australia", "New Caledonia", "New Zealand", "South Africa",
        "Ireland", "Wallis and Futuna", "Bahrain", "Hong Kong", "Dubai", "United Kingdom",
        "French Polynesia"
    ];

   const breeds = {
         'Cat': [
             "Abyssinian", "American Bobtail", "American Curl", "American Shorthair", "American Wirehair", "Asian", "Australian Mist", "Balinese", "Bengal", "Birman (Sacred Birman)", "Bohemian Rex", "Bombay", "British Longhair", "British Shorthair", "Burmese", "Burmilla", "Californian Rex", "Chartreux", "Cornish Rex", "Cymric", "Devon Rex", "Domestic Cat", "Donskoy (Don Sphynx)", "Egyptian Mau", "European", "Exotic Fold", "Exotic Shorthair", "German Rex", "Highland Fold", "Himalayan", "Japanese Bobtail", "Korat", "Kurilian Bobtail", "LaPerm", "Lykoi", "Maine Coon", "Manx", "Mekong Bobtail", "Munchkin", "Nebelung", "Neva Masquerade", "Norwegian Forest Cat", "Ocicat", "Oriental", "Persian", "Peterbald", "Ragamuffin", "Ragdoll", "Russian Blue", "Savannah", "Scottish Fold", "Selkirk Rex", "Siamese", "Siberian", "Singapura", "Snowshoe", "Sokoke", "Somali", "Sphynx", "Thai", "Tiffanie", "Tonkinese", "Toyger", "Turkish Angora", "Turkish Van", "Others"
         ],
         'Dog': [
             "Affenpinscher", "Airedale Terrier", "Akita Inu", "Alaskan Klee Kai", "Alaskan Malamute", "American Akita", "American Bully", "American Pit Bull Terrier", "American Staffordshire Terrier", "Anatolian Shepherd", "Appenzeller Sennenhund", "Atlas Shepherd (Aidi)", "Australian Cattle Dog", "Australian Shepherd", "Australian Terrier", "Basenji", "Basset Hound", "Bearded Collie", "Beauceron", "Belgian Malinois", "Belgian Shepherd", "Bernese Mountain Dog", "Bichon Frise", "Bloodhound", "Boerboel", "Border Collie", "Border Terrier", "Borzoi", "Boston Terrier", "Bouvier des Ardennes", "Bouvier des Flandres", "Boxer", "Briard", "Brittany Spaniel", "Broholmer", "Brussels Griffon", "Bull Terrier", "Bullmastiff", "Ca de Bou (Majorcan Mastiff)", "Cairn Terrier", "Cane Corso", "Catalan Sheepdog", "Caucasian Shepherd Dog", "Cavalier King Charles Spaniel", "Chihuahua", "Chow Chow", "Cocker Spaniel", "Collie", "Coton de Tulear", "Czechoslovakian Wolfdog", "Dachshund", "Dalmatian", "Doberman", "Dogo Argentino", "Dogue de Bordeaux", "Dutch Smoushond (Kooikerhondje)", "English Bulldog", "English Pointer", "Fila Brasileiro", "Finnish Spitz", "Fox Terrier", "French Bulldog", "German Shepherd", "German Spitz", "Golden Retriever", "Great Dane", "Greater Swiss Mountain Dog", "Greyhound", "Icelandic Sheepdog", "Italian Greyhound", "Italian Spitz", "Jack Russell Terrier", "Japanese Spaniel (Japanese Chin)", "Japanese Spitz", "Japanese Terrier", "King Charles Spaniel", "Komondor", "Labrador Retriever", "Leonberger", "Lhasa Apso", "Maltese", "Mastiff", "Neapolitan Mastiff", "Newfoundland", "Norfolk Terrier", "Old English Sheepdog (Bobtail)", "Pekingese", "Picardy Shepherd", "Pinscher", "Pointer", "Polish Lowland Sheepdog", "Pomeranian", "Poodle", "Portuguese Water Dog", "Pug", "Puli/Pumi/Mudi", "Pyrenean Mastiff", "Pyrenean Mountain Dog", "Pyrenean Shepherd", "Rhodesian Ridgeback", "Rottweiler", "Saint Bernard", "Saluki", "Samoyed", "Schnauzer", "Scottish Terrier", "Setter", "Shar Pei", "Shetland Sheepdog", "Shiba Inu", "Shih Tzu", "Siberian Husky", "Skye Terrier", "Staffordshire Bull Terrier", "Standard Poodle", "Swiss White Shepherd", "Tervuren Shepherd", "Tibetan Mastiff", "Tibetan Spaniel", "Tibetan Terrier", "Tosa", "Weimaraner", "Welsh Corgi", "Welsh Terrier", "West Highland White Terrier", "Whippet", "Yorkshire Terrier", "Others"
         ],
         'NAC': nacBreeds,
         'Bird': [
             "Ara", "Cockatoo", "Caique", "Canary", "Conure", "Eclectus", "African Grey",
             "Lory", "Lovebird", "Ring-necked Parakeet", "Budgerigar", "Amazon Parrot", "Others"
         ],
         'Rabbit': [
             "Holland Lop (lop-eared dwarf)", "Netherland Dwarf", "Angora Dwarf (long-haired)", "Lionhead Rabbit (mane around the head)", "Dutch Rabbit",
             "Burgundy Fawn", "Norman", "English Butterfly", "Flemish Giant", "White Giant Rabbit from Bouscat", "Others"
         ],
         'Others': []
    };
    // --- DOM Elements & Initial Setup ---
    const page1 = document.getElementById('page-1');
    const page2 = document.getElementById('page-2');
    const page3 = document.getElementById('page-3');

    const addPetBtn = document.getElementById('add-pet-btn');
    const nextPage1Btn = document.getElementById('next-page-1-btn');
    const prevPage2Btn = document.getElementById('prev-page-2-btn');
    const nextPage2Btn = document.getElementById('next-page-2-btn');
    const prevPage3Btn = document.getElementById('prev-page-3-btn');
    const langToggleBtn = document.getElementById('lang-toggle-btn');

    const petFormsContainer = document.getElementById('pet-forms-container');
    const form = document.getElementById('pet-form');

    const conditionalQuestion = document.getElementById('conditional-question');
    const travelOption = document.getElementById('travel-option');
    const contextField = document.getElementById('context-field');
    const contextSelect = document.getElementById('context');
    const otherMeansField = document.getElementById('other-means-field');

    let petIdCounter = 0;

    // --- Translation Helper Function ---
    function translateOption(value, lang) {
        if (lang === 'fr') {
            if (value in animalTypeMap_fr) return animalTypeMap_fr[value];
            if (value in breedsMap_fr) return breedsMap_fr[value];
        }
        return value; // Default to English/Value
    }

    // --- Language Update Function (now includes country translation) ---
    function updateContent(lang) {
        const t = translations[lang];

        // 1. Update static elements (with data-key)
        document.querySelectorAll('[data-key]').forEach(element => {
            const key = element.getAttribute('data-key');
            if (t[key]) {
                if (element.tagName === 'OPTION') {
                    element.textContent = t[key];
                } else if (element.tagName === 'INPUT' && element.type === 'submit') {
                    element.value = t[key];
                } else {
                    element.textContent = t[key];
                }
            }
        });
        
        // 2. Update Country dropdowns
        const countrySelects = document.querySelectorAll('#departure-country, #destination-country');
        const countryMap = lang === 'fr' ? countryMap_fr : {}; // Use French map or empty map for English

        countrySelects.forEach(select => {
            // Iterate over options that are NOT the placeholder option (which has data-key="select_country_option")
            select.querySelectorAll('option:not([data-key="select_country_option"])').forEach(option => {
                const englishValue = option.value;
                // If in French, use the translation; otherwise, use the English value (which is the default text in HTML)
                option.textContent = countryMap[englishValue] || englishValue;
            });
        });

        // 3. Update pet forms (dynamic content: Animal Type and Breed options)
        renumberPets();
        
        // 4. Update the language toggle button text and attribute
        langToggleBtn.textContent = t.lang_toggle_text;
        langToggleBtn.dataset.lang = lang === 'fr' ? 'en' : 'fr';
    }


    // --- Pet Form Management ---

    function renumberPets() {
        const petForms = document.querySelectorAll('.pet-form');
        const t = translations[currentLang];
        petForms.forEach((petForm, index) => {
            const heading = petForm.querySelector('h4');
            if (heading) {
                heading.textContent = `${t.pet_heading} ${index + 1}`;
            }
            // Update static labels/buttons within the pet form
            petForm.querySelector('label[for^="animal-type"]').textContent = t.animal_type_label;
            const breedLabel = petForm.querySelector('label[for^="breed"]');
            if (breedLabel) breedLabel.textContent = t.breed_label;
            const otherAnimalLabel = petForm.querySelector('label[for^="other-animal-custom"]');
            if (otherAnimalLabel) otherAnimalLabel.textContent = t.other_animal_label;
            petForm.querySelector('label[for^="age"]').textContent = t.age_label;
            petForm.querySelector('label[for^="weight"]').textContent = t.weight_label;
            petForm.querySelector('.remove-pet-btn').textContent = t.remove_pet_btn;
            
            // Update Animal Type dropdown options
            const typeSelect = petForm.querySelector('select[name^="animal-type"]');
            if (typeSelect) {
                const defaultOption = typeSelect.querySelector('option[value=""]');
                if (defaultOption) defaultOption.textContent = t.choose_animal_type;
                
                typeSelect.querySelectorAll('option:not([value=""])').forEach(option => {
                    // Translate the display text using the English value
                    option.textContent = translateOption(option.value, currentLang);
                });
            }
            
            // Update Breed dropdown options
            const breedSelect = petForm.querySelector('select[name^="breed"]');
            if (breedSelect && breedSelect.children.length > 0) {
                 const defaultOption = breedSelect.querySelector('option[value=""]');
                 if (defaultOption) defaultOption.textContent = t.select_breed;
                 
                 breedSelect.querySelectorAll('option:not([value=""])').forEach(option => {
                    // Translate the display text using the English value
                    option.textContent = translateOption(option.value, currentLang);
                });
            }
        });
    }

    function createPetForm() {
        petIdCounter++;
        const t = translations[currentLang];
        const petForm = document.createElement('div');
        petForm.classList.add('pet-form');
        petForm.dataset.id = petIdCounter;
        
        // Map the English keys to their translated display text for initial creation
        const animalTypeOptions = Object.keys(breeds).map(type_value => 
            `<option value="${type_value}">${translateOption(type_value, currentLang)}</option>`
        ).join('');
        
        petForm.innerHTML = `
            <h4>${t.pet_heading} ${petIdCounter}</h4> 
            <label for="animal-type-${petIdCounter}">${t.animal_type_label}</label>
            <select id="animal-type-${petIdCounter}" name="animal-type-${petIdCounter}" required>
                <option value="">${t.choose_animal_type}</option>
                ${animalTypeOptions}
            </select>

            <div class="breed-container" style="display: none;">
                <label for="breed-${petIdCounter}">${t.breed_label}</label>
                <select id="breed-${petIdCounter}" name="breed-${petIdCounter}"></select>
            </div>

            <div class="other-animal-container" style="display: none;">
                <label for="other-animal-custom-${petIdCounter}">${t.other_animal_label}</label>
                <input type="text" id="other-animal-custom-${petIdCounter}" name="other-animal-custom-${petIdCounter}">
            </div>

            <label for="age-${petIdCounter}">${t.age_label}</label>
            <input type="text" id="age-${petIdCounter}" name="age-${petIdCounter}" required>

            <label for="weight-${petIdCounter}">${t.weight_label}</label>
            <input type="text" id="weight-${petIdCounter}" name="weight-${petIdCounter}" required>
            
            <button type="button" class="remove-pet-btn">${t.remove_pet_btn}</button>
        `;

        petFormsContainer.appendChild(petForm);
        renumberPets();

        // Event listener for the new animal type dropdown
        const animalTypeSelect = petForm.querySelector(`#animal-type-${petIdCounter}`);
        
        animalTypeSelect.addEventListener('change', (e) => {
            const breedContainer = petForm.querySelector('.breed-container');
            const breedSelect = petForm.querySelector(`#breed-${petIdCounter}`);
            const otherContainer = petForm.querySelector('.other-animal-container');
            const otherInput = petForm.querySelector(`#other-animal-custom-${petIdCounter}`);
            
            const selectedType = e.target.value;

            // Reset UI
            breedContainer.style.display = 'none';
            breedSelect.required = false;
            breedSelect.innerHTML = '';
            
            otherContainer.style.display = 'none';
            otherInput.required = false;

            if (selectedType === 'Others') {
                otherContainer.style.display = 'block';
                otherInput.required = true;
            } else if (selectedType && breeds[selectedType]) {
                const t_select_breed = translations[currentLang].select_breed;
                breedSelect.innerHTML = `<option value="">${t_select_breed}</option>`;
                
                breeds[selectedType].forEach(breed_value => {
                    const option = document.createElement('option');
                    option.value = breed_value; // English/Standardized value for form data
                    option.textContent = translateOption(breed_value, currentLang); // Translated display text
                    breedSelect.appendChild(option);
                });
                breedContainer.style.display = 'block';
                breedSelect.required = true;
            }
        });
        
        // Remove button listener
        petForm.querySelector('.remove-pet-btn').addEventListener('click', () => {
            petForm.remove();
            renumberPets();
        });
    }
    
    // Create the first pet form and apply initial language
    createPetForm();
    updateContent(currentLang);

    addPetBtn.addEventListener('click', createPetForm);
    
    // --- Validation Helper ---
    function validatePage(pageElement) {
        let isValid = true;
        const requiredInputs = pageElement.querySelectorAll('[required]');

        requiredInputs.forEach(input => {
            // Check visibility
            let isVisible = false;
            
            const style = window.getComputedStyle(input);
            if (style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0') {
                isVisible = true;
            }

            if (isVisible) {
                let parent = input.parentElement;
                while (parent && parent !== pageElement) {
                    const parentStyle = window.getComputedStyle(parent);
                    if (parentStyle.display === 'none') {
                        isVisible = false;
                        break;
                    }
                    parent = parent.parentElement;
                }
            }
            
            if (isVisible && !input.value.trim()) {
                isValid = false;
                input.classList.add('error');
            } else {
                input.classList.remove('error');
            }
        });
        return isValid;
    }

    // --- Page Navigation ---
    if (nextPage1Btn) {
        nextPage1Btn.addEventListener('click', () => {
            if (validatePage(page1)) {
                page1.style.display = 'none';
                page2.style.display = 'block';
                page1.classList.remove('active');
                page2.classList.add('active');
            } else {
                alert(translations[currentLang].error_alert);
            }
        });
    }

    if (prevPage2Btn) {
        prevPage2Btn.addEventListener('click', () => {
            page2.style.display = 'none';
            page1.style.display = 'block';
        });
    }

    if (nextPage2Btn) {
        nextPage2Btn.addEventListener('click', () => {
            if (validatePage(page2)) {
                page2.style.display = 'none';
                page3.style.display = 'block';
                checkQualification(); // Run logic when entering Page 3
            } else {
                alert(translations[currentLang].error_alert);
            }
        });
    }

    if (prevPage3Btn) {
        prevPage3Btn.addEventListener('click', () => {
            page3.style.display = 'none';
            page2.style.display = 'block';
        });
    }

    // --- Conditional Logic (Page 3) ---
    function checkQualification() {
        // Correctly retrieves the value from the destination country field
        const destinationCountryElement = document.getElementById('destination-country');
        const destinationCountry = destinationCountryElement ? destinationCountryElement.value : '';
        const petForms = document.querySelectorAll('.pet-form');
        
        let isAtLeastOnePetQualified = false;

        petForms.forEach(petForm => {
            const animalTypeSelect = petForm.querySelector('select[name^="animal-type"]');
            const breedSelect = petForm.querySelector('select[name^="breed"]');
            
            // Values are always the English/Standard name for the check
            const animalType = animalTypeSelect ? animalTypeSelect.value : '';
            const breed = breedSelect ? breedSelect.value : '';

            // 1. Check Specific Qualified Breeds (using English/Standard list)
            if (animalType === 'Dog' && qualifiedDogs.includes(breed)) {
                isAtLeastOnePetQualified = true;
            } 
            else if (animalType === 'Cat' && qualifiedCats.includes(breed)) {
                isAtLeastOnePetQualified = true;
            } 
            // 2. Check Auto-Qualified Types (Bird, Rabbit, NAC)
            else if (['Bird', 'Rabbit', 'NAC'].includes(animalType)) {
                isAtLeastOnePetQualified = true;
            }
        });

        const isCountryQualified = qualifiedCountries.includes(destinationCountry);

        // Logic: Question appears ONLY if Country is Negative AND All Pets are Negative.
        if (!isCountryQualified && !isAtLeastOnePetQualified) {
            conditionalQuestion.style.display = 'block';
            travelOption.required = true;
        } else {
            conditionalQuestion.style.display = 'none';
            travelOption.required = false;
            // Reset children
            contextField.style.display = 'none';
            contextSelect.required = false;
            document.getElementById('other-means').required = false;
        }
    }

    travelOption.addEventListener('change', (e) => {
        if (e.target.value === 'alone') {
            contextField.style.display = 'block';
            contextSelect.required = true;
        } else {
            contextField.style.display = 'none';
            contextSelect.required = false;
            otherMeansField.style.display = 'none';
            document.getElementById('other-means').required = false;
        }
    });

    contextSelect.addEventListener('change', (e) => {
        const otherMeansInput = document.getElementById('other-means');
        if (e.target.value === 'others') {
            otherMeansField.style.display = 'block';
            otherMeansInput.required = true;
        } else {
            otherMeansField.style.display = 'none';
            otherMeansInput.required = false;
        }
    });

    // --- Language Toggle Listener ---
    langToggleBtn.addEventListener('click', () => {
        currentLang = langToggleBtn.dataset.lang; // 'en' or 'fr'
        updateContent(currentLang);
        if (page3.style.display !== 'none') {
             checkQualification();
        }
    });

    // --- Form Submission ---
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!validatePage(page3)) {
            alert(translations[currentLang].error_alert);
            return;
        }

        const formData = new FormData(form);
        const data = { pets: [] };

        const forms = document.querySelectorAll('.pet-form');
        forms.forEach(pForm => {
            const id = pForm.dataset.id;
            const type = formData.get(`animal-type-${id}`);
            let breedVal = formData.get(`breed-${id}`) || '';
            
            if (type === 'Others') {
                breedVal = formData.get(`other-animal-custom-${id}`);
            }

            data.pets.push({
                animal_type: type, 
                breed: breedVal,
                age: formData.get(`age-${id}`),
                weight: formData.get(`weight-${id}`)
            });
        });

        // Common Fields
        data['departure-address'] = formData.get('departure-address');
        data['departure-country'] = formData.get('departure-country');
        data['destination-address'] = formData.get('destination-address');
        data['destination-country'] = formData.get('destination-country');
        data['departure-date'] = formData.get('departure-date');
        data['travel-option'] = formData.get('travel-option') || '';
        data['context'] = formData.get('context') || '';
        data['other-means'] = formData.get('other-means') || '';
        data['additional-info'] = formData.get('additional-info');

        console.log('Sending:', data);

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = translations[currentLang].sending;

        try {
            // NOTE: Ensure this URL is correct for your server
            const response = await fetch('https://forms.worldbaggagenetwork.com/wp-json/pet-transport/v1/request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.message || 'Server error');
            }

            alert(translations[currentLang].submit_success);
            form.reset();
            window.location.reload(); // Refresh to reset state cleanly

        } catch (error) {
            console.error(error);
            alert(`${translations[currentLang].submit_failure} ${error.message}`);
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
        }
    });
});