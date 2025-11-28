// --- Google Maps Place Autocomplete Functions (Global Scope) ---
function getCountry(place) {
    if (!place.addressComponents) return null;
    const countryComponent = place.addressComponents.find(c => c.types.includes('country'));
    return countryComponent ? countryComponent.longText : null;
}

function findAndSelectCountry(choiceInstance, countryNameToFind) {
    if (!countryNameToFind || !choiceInstance) return;

    const normalizedCountry = countryNameToFind.toLowerCase().trim();
    let bestMatch = null;

    // Specific mapping for common discrepancies
    const countryMappings = {
        "united states": "United States of America",
        "usa": "United States of America",
        "uk": "United Kingdom",
        "great britain": "United Kingdom"
    };

    const mappedCountry = countryMappings[normalizedCountry];
    if (mappedCountry) {
        choiceInstance.setValue(mappedCountry);
        return;
    }
    
    // The getChoices method is not standard, we need to get the choices from the original select element
    const selectElement = choiceInstance.passedElement.element;
    for (const option of selectElement.options) {
        const optionValue = option.value.toLowerCase().trim();
        const optionText = option.textContent.toLowerCase().trim();

        // 1. Exact match on value or text
        if (optionValue === normalizedCountry || optionText === normalizedCountry) {
            bestMatch = option.value;
            break; 
        }
        
        // 2. Substring match (if no exact match found yet)
        if (!bestMatch && (optionValue.includes(normalizedCountry) || normalizedCountry.includes(optionValue))) {
            bestMatch = option.value;
        }
    }

    if (bestMatch) {
        choiceInstance.setValue(bestMatch);
    } else {
        console.warn(`Could not find a matching country for: "${countryNameToFind}"`);
    }
}

// This function is called by the Google Maps API callback when it's ready
function initAutocomplete() {
    const departureAutocomplete = document.getElementById('departure-address');
    const destinationAutocomplete = document.getElementById('destination-address');
    
    // Check if elements exist and Choices instances are ready
    if (!departureAutocomplete || !destinationAutocomplete || !window.departureChoice || !window.destinationChoice) {
        return;
    }

    // --- Add event listeners directly to the elements from the HTML ---
    departureAutocomplete.addEventListener('gmp-placeselect', (event) => {
        const place = event.place;
        const countryName = getCountry(place);
        findAndSelectCountry(window.departureChoice, countryName);
    });

    destinationAutocomplete.addEventListener('gmp-placeselect', (event) => {
        const place = event.place;
        const countryName = getCountry(place);
        findAndSelectCountry(window.destinationChoice, countryName);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    
    // --- Choices.js Initialization ---
    const departureCountrySelect = document.getElementById('departure-country');
    const destinationCountrySelect = document.getElementById('destination-country');

    const choiceOptions = {
        searchEnabled: true,
        itemSelectText: '',
    };

    window.departureChoice = new Choices(departureCountrySelect, choiceOptions);
    window.destinationChoice = new Choices(destinationCountrySelect, choiceOptions);

    // --- Intl Tel Input Initialization (Phone & WhatsApp) ---
    const phoneInput = document.getElementById('phone');
    const whatsappInput = document.getElementById('whatsapp');

    const itiOptions = {
        utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@18.2.1/build/js/utils.js",
        preferredCountries: ['fr', 'us', 'gb', 'ca', 'au'], 
        separateDialCode: true
    };

    // Initialize instances
    const phoneIti = window.intlTelInput(phoneInput, itiOptions);
    const whatsappIti = window.intlTelInput(whatsappInput, itiOptions);

    // --- Translations Object ---
    const translations = {
        'fr': {
            title: "Formulaire de Transport d'Animaux",
            page1_title: "Informations sur l'Animal",
            page2_title: "Dites-nous quel est votre projet.",
            page3_title: "Conditions de Voyage",
            page4_title: "Coordonnées",
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
            
            // Page 4 Translations
            first_name_label: "Prénom:",
            last_name_label: "Nom:",
            email_label: "Adresse Email:",
            phone_label: "Numéro de Téléphone:",
            whatsapp_label: "Numéro WhatsApp (Optionnel):",
            consent_label: "J'ai lu et j'accepte les Conditions Générales et les Politiques de Confidentialité.",
            add_pet_btn: "Ajouter un Animal",
            next_btn: "Suivant",
            prev_btn: "Précédent",
            submit_btn: "Soumettre",
            pet_heading: "Animal",
            remove_pet_btn: "Supprimer l'Animal",
            animal_type_label: "Type d'Animal:",
            breed_label: "Race:",
            other_animal_label: "Spécifiez Type d'Animal & Race:",
            specify_breed_label: "Veuillez spécifier la race:", 
            age_label: "Âge:",
            weight_label: "Poids:",
            choose_animal_type: "--Veuillez choisir une option--",
            select_breed: "--Sélectionner Race--",
            error_alert: "Veuillez remplir tous les champs obligatoires (Lettres uniquement pour les noms).",
            submit_success: "Demande soumise avec succès!",
            submit_failure: "La soumission a échoué: ",
            sending: "Envoi en cours...",
            lang_toggle_text: "English"
        },
        'en': {
            title: "Pet Transport Form",
            page1_title: "Pet Information",
            page2_title: "Tell us what your project is.",
            page3_title: "Travel Conditions",
            page4_title: "Contact Information",
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
            
            // Page 4 Translations
            first_name_label: "First Name:",
            last_name_label: "Last Name:",
            email_label: "Email Address:",
            phone_label: "Phone Number:",
            whatsapp_label: "WhatsApp Number (Optional):",
            consent_label: "I have read and accept the Terms and Conditions and Privacy Policies.",
            add_pet_btn: "Add Pet",
            next_btn: "Next",
            prev_btn: "Previous",
            submit_btn: "Submit",
            pet_heading: "Pet",
            remove_pet_btn: "Remove Pet",
            animal_type_label: "Animal Type:",
            breed_label: "Breed:",
            other_animal_label: "Specify Animal Type & Breed:",
            specify_breed_label: "Please specify the breed:", 
            age_label: "Age:",
            weight_label: "Weight:",
            choose_animal_type: "--Please choose an option--",
            select_breed: "--Select Breed--",
            error_alert: "Please fill in all required fields (Letters only for names).",
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
        // Cats
        "Abyssinian": "Abyssin", "American Bobtail": "Bobtail Américain (Poil long – Poil court)", "American Curl": "American Curl (Poil long – Poil court)", "American Shorthair": "American Shorthair", "American Wirehair": "American Wirehair", "Asian": "Asiatique (Poil long – Poil court)", "Australian Mist": "Australian Mist", "Balinese": "Balinais", "Bengal": "Bengal", "Birman (Sacred Birman)": "Sacré de Birmanie", "Bohemian Rex": "Rex de Bohême", "Bombay": "Bombay", "British Longhair": "Britannique à Poil Long", "British Shorthair": "Britannique à Poil Court", "Burmese": "Burmese", "Burmilla": "Burmilla", "Californian Rex": "Rex Californien", "Chartreux": "Chartreux", "Cornish Rex": "Cornish Rex", "Cymric": "Cymric (Manx à poil mi-long)", "Devon Rex": "Devon Rex", "Domestic Cat": "Chat Domestique (Poil long – Poil court)", "Donskoy (Don Sphynx)": "Donskoy (Sphynx du Don)", "Egyptian Mau": "Mau Égyptien", "European": "Européen", "Exotic Fold": "Exotic Fold", "Exotic Shorthair": "Exotic Shorthair", "German Rex": "Rex Allemand", "Highland Fold": "Highland Fold (Écossais à Poil Long)", "Himalayan": "Himalayen", "Japanese Bobtail": "Bobtail Japonais", "Korat": "Korat", "Kurilian Bobtail": "Bobtail des Kouriles (Poil long – Poil court)", "LaPerm": "LaPerm (Poil long – Poil court)", "Lykoi": "Lykoï", "Maine Coon": "Maine Coon", "Manx": "Manx", "Mekong Bobtail": "Bobtail du Mékong", "Munchkin": "Munchkin", "Nebelung": "Nebelung", "Neva Masquerade": "Neva Mascarade", "Norwegian Forest Cat": "Norvégien", "Ocicat": "Ocicat", "Oriental": "Oriental (Poil long – Poil court)", "Persian": "Persan", "Peterbald": "Peterbald", "Ragamuffin": "Ragamuffin", "Ragdoll": "Ragdoll", "Russian Blue": "Bleu Russe", "Savannah": "Savannah", "Scottish Fold": "Scottish Fold", "Selkirk Rex": "Selkirk Rex (Poil long – Poil court)", "Siamese": "Siamois", "Siberian": "Sibérien", "Singapura": "Singapura", "Snowshoe": "Snowshoe", "Sokoke": "Sokoke", "Somali": "Somali (Abyssin à poil mi-long)", "Sphynx": "Sphynx", "Thai": "Thaï", "Tiffanie": "Tiffanie", "Tonkinese": "Tonkinois (Poil long – Poil court)", "Toyger": "Toyger", "Turkish Angora": "Angora Turc", "Turkish Van": "Turc de Van",
        // Dogs
        "Affenpinscher": "Affenpinscher", "Airedale Terrier": "Airedale Terrier", "Akita Inu": "Akita Inu", "Alaskan Klee Kai": "Alaskan Klee Kai", "Alaskan Malamute": "Malamute de l'Alaska", "American Akita": "Akita Américain", "American Bully": "American Bully", "American Pit Bull Terrier": "American Pit Bull", "American Staffordshire Terrier": "American Staffordshire Terrier (Amstaff)", "Anatolian Shepherd": "Berger d'Anatolie (Kangal ou Karabash)", "Appenzeller Sennenhund": "Bouvier d'Appenzell", "Atlas Shepherd (Aidi)": "Aïdi (Berger de l'Atlas)", "Australian Cattle Dog": "Australian Cattle Dog", "Australian Shepherd": "Berger Australien", "Australian Terrier": "Australian Terrier", "Basenji": "Basenji", "Basset Hound": "Basset", "Beagle": "Beagle", "Bearded Collie": "Colley Barbu", "Beauceron": "Beauceron", "Belgian Malinois": "Malinois", "Belgian Shepherd": "Berger Belge", "Bernese Mountain Dog": "Bouvier Bernois", "Bichon Frise": "Bichon Frisé", "Bloodhound": "Chien de Saint-Hubert (Bloodhound)", "Blue Gascon": "Bleu de Gascogne", "Boerboel": "Boerboel", "Border Collie": "Border Collie", "Border Terrier": "Border Terrier", "Borzoi": "Barzoï", "Boston Terrier": "Boston Terrier", "Bouvier des Ardennes": "Bouvier des Ardennes", "Bouvier des Flandres": "Bouvier des Flandres", "Boxer": "Boxer", "Briard": "Berger de Brie", "Brittany Spaniel": "Épagneul Breton", "Broholmer": "Broholmer", "Brussels Griffon": "Griffon Bruxellois", "Bull Terrier": "Bull Terrier", "Bullmastiff": "Bullmastiff", "Ca de Bou (Majorcan Mastiff)": "Ca de Bou (Dogue de Majorque)", "Cairn Terrier": "Cairn Terrier", "Cane Corso": "Cane Corso (Mâtin Italien)", "Catalan Sheepdog": "Berger Catalan", "Caucasian Shepherd Dog": "Berger du Caucase ou d'Asie Centrale (Ovcharka)", "Cavalier King Charles Spaniel": "Cavalier King Charles Spaniel", "Chihuahua": "Chihuahua (Tête de Pomme / Tête de Cerf)", "Chow Chow": "Chow Chow", "Cocker Spaniel": "Cocker Spaniel", "Collie": "Colley", "Coton de Tulear": "Coton de Tuléar", "Creole or Mangrove Shepherd": "Berger Créole ou des Mangroves", "Czechoslovakian Wolfdog": "Chien-loup Tchécoslovaque", "Dachshund": "Teckel", "Dalmatian": "Dalmatien", "Doberman": "Doberman", "Dogo Argentino": "Dogue Argentin", "Dogue Canario (Presa Canario)": "Dogue des Canaries (Presa Canario)", "Dogue de Bordeaux": "Dogue de Bordeaux (Mâtin Français)", "Dutch Smoushond (Kooikerhondje)": "Kooikerhondje", "English Bulldog": "Bulldog Anglais", "English Pointer": "Pointer Anglais", "Fila Brasileiro": "Fila Brasileiro", "Finnish Spitz": "Spitz Finlandais", "Fox Terrier": "Fox Terrier", "French Bulldog": "Bouledogue Français", "French Foxhound": "Foxhound Français", "American Foxhound": "Foxhound Américain", "German Shepherd": "Berger Allemand", "German Shorthaired Pointer": "Braque Allemand à Poil Court", "German Wirehaired Pointer": "Braque Allemand à Poil Dur", "German Spitz": "Spitz Allemand", "Golden Retriever": "Golden Retriever", "Great Dane": "Danois (Grand Danois)", "Greater Swiss Mountain Dog": "Grand Bouvier Suisse", "Greyhound": "Lévrier Anglais", "Icelandic Sheepdog": "Chien de Berger Islandais", "Italian Greyhound": "Petit Lévrier Italien", "Italian Spitz": "Spitz Italien", "Jack Russell Terrier": "Jack Russell", "Japanese Spaniel (Japanese Chin)": "Chin Japonais", "Japanese Spitz": "Spitz Japonais", "Japanese Terrier": "Terrier Japonais", "King Charles Spaniel": "King Charles Spaniel", "Komondor": "Komondor", "Kooikerhondje": "Kooikerhondje (Petit Chien Hollandais)", "Labrador Retriever": "Labrador Retriever", "Leonberger": "Leonberger", "Lhasa Apso": "Lhassa Apso", "Maltese": "Bichon Maltais", "Mastiff": "Mastiff (Vieux Mâtin Anglais)", "Medium Poodle": "Caniche Moyen", "Toy Poodle": "Caniche Toy", "Mudi": "Mudi", "Neapolitan Mastiff": "Mâtin Napolitain", "Newfoundland": "Terre-Neuve", "Norfolk Terrier": "Norfolk Terrier", "Old English Sheepdog (Bobtail)": "Bobtail (Ancien Chien de Berger Anglais)", "Pekingese": "Pékinois", "Picardy Shepherd": "Berger Picard", "Picardy Spaniel": "Épagneul Picard", "Pinscher": "Pinscher", "Pointer": "Pointer", "Polish Lowland Sheepdog": "Berger Polonais de Plaine", "Pomeranian": "Spitz Nain (Pomeranian)", "Poodle": "Caniche", "Portuguese Shepherd": "Berger Portugais", "Portuguese Water Dog": "Chien d'Eau Portugais", "Pug": "Carlin", "Puli": "Puli", "Pumi": "Pumi", "Pyrenean Mastiff": "Mâtin des Pyrénées", "Pyrenean Mountain Dog": "Chien de Montagne des Pyrénées", "Pyrenean Shepherd": "Berger des Pyrénées", "Rhodesian Ridgeback": "Rhodesian Ridgeback", "Rottweiler": "Rottweiler", "Saint Bernard": "Saint-Bernard", "Saluki": "Saluki", "Samoyed": "Samoyède", "Schnauzer": "Schnauzer", "Scottish Terrier": "Scottish Terrier", "Setter": "Setter", "Shar Pei": "Shar Pei", "Shetland Sheepdog": "Berger des Shetland", "Shiba Inu": "Shiba Inu", "Shih Tzu": "Shih Tzu", "Siberian Husky": "Husky Sibérien", "Silky Terrier": "Silky Terrier", "Spanish Mastiff": "Mâtin Espagnol", "Spitz": "Spitz", "Staffordshire Bull Terrier": "Staffordshire Bull Terrier (Staffie)", "Tibetan Mastiff": "Mâtin du Tibet", "Tibetan Spaniel": "Épagneul Tibétain", "Tibetan Terrier": "Terrier du Tibet", "Tosa": "Tosa (Mâtin Japonais)", "Toy Terrier": "Terrier Toy", "Weimaraner": "Braque de Weimar", "Welsh Corgi": "Corgi Gallois", "Welsh Terrier": "Welsh Terrier", "West Highland White Terrier": "West Highland White Terrier (Westie)", "Whippet": "Whippet", "White Swiss Shepherd": "Berger Blanc Suisse", "Yorkshire Terrier": "Yorkshire Terrier", 
        // Other
        "Chinchilla": "Chinchilla", "Guinea Pig": "Cochon d'Inde", "Ferret": "Furet", "Gecko": "Gecko", "Lizard": "Lézard", "Salamander": "Salamandre", "Domestic Rat": "Rat Domestique", "Snake": "Serpent", "Turtle": "Tortue",
        "Ara": "Ara", "Cockatoo": "Cacatoès", "Caique": "Caïque", "Canary": "Canari", "Conure": "Conure", "Eclectus": "Éclectus", "African Grey": "Gris du Gabon", "Lory": "Lori", "Lovebird": "Inséparable", "Ring-necked Parakeet": "Perruche à Collier", "Budgerigar": "Perruche Ondulée", "Amazon Parrot": "Perroquet Amazonien",
        "Holland Lop (lop-eared dwarf)": "Lapin Nain Bélier", "Netherland Dwarf": "Lapin Nain de Couleur", "Angora Dwarf (long-haired)": "Lapin Angora Nain", "Lionhead Rabbit (mane around the head)": "Lapin Tête de Lion", "Dutch Rabbit": "Lapin Hollandais", "Burgundy Fawn": "Fauve de Bourgogne", "Norman": "Normand", "English Butterfly": "Papillon Anglais", "Flemish Giant": "Géant des Flandres", "White Giant Rabbit from Bouscat": "Géant Blanc du Bouscat",
        "Others": "Autres"
    };
    
    // Country Map (English Value -> French Display Text)
    const countryMap_fr = {
        "Afghanistan": "Afghanistan", "Albania": "Albanie", "Algeria": "Algérie", "Andorra": "Andorre", "Angola": "Angola", "Antigua and Barbuda": "Antigua-et-Barbuda", "Argentina": "Argentine", "Armenia": "Arménie", "Australia": "Australie", "Austria": "Autriche", "Azerbaijan": "Azerbaïdjan", "Bahamas": "Bahamas", "Bahrain": "Bahreïn", "Bangladesh": "Bangladesh", "Barbados": "Barbade", "Belarus": "Bélarus", "Belgium": "Belgique", "Belize": "Belize", "Benin": "Bénin", "Bhutan": "Bhoutan", "Bolivia": "Bolivie", "Bosnia and Herzegovina": "Bosnie-Herzégovine", "Botswana": "Botswana", "Brazil": "Brésil", "Brunei": "Brunei", "Bulgaria": "Bulgarie", "Burkina Faso": "Burkina Faso", "Burundi": "Burundi", "Cabo Verde": "Cabo Verde", "Cambodia": "Cambodge", "Cameroon": "Cameroun", "Canada": "Canada", "Central African Republic": "République centrafricaine", "Chad": "Tchad", "Chile": "Chili", "China": "Chine", "Colombia": "Colombie", "Comoros": "Comores", "Costa Rica": "Costa Rica", "Croatia": "Croatie", "Cuba": "Cuba", "Cyprus": "Chypre", "Czech Republic": "République Tchèque", "Democratic Republic of the Congo": "République démocratique du Congo", "Denmark": "Danemark", "Djibouti": "Djibouti", "Dominica": "Dominique", "Dominican Republic": "République Dominicaine", "Ecuador": "Équateur", "Egypt": "Égypte", "El Salvador": "El Salvador", "Equatorial Guinea": "Guinée équatoriale", "Eritrea": "Érythrée", "Estonia": "Estonie", "Eswatini": "Eswatini", "Ethiopia": "Éthiopie", "Fiji": "Fidji", "Finland": "Finlande", "France": "France", "Gabon": "Gabon", "Gambia": "Gambie", "Georgia": "Géorgie", "Germany": "Allemagne", "Ghana": "Ghana", "Greece": "Grèce", "Grenada": "Grenade", "Guatemala": "Guatemala", "Guinea": "Guinée", "Guinea-Bissau": "Guinée-Bissau", "Guyana": "Guyana", "Haiti": "Haïti", "Honduras": "Honduras", "Hungary": "Hongrie", "Iceland": "Islande", "India": "Inde", "Indonesia": "Indonésie", "Iran": "Iran", "Iraq": "Irak", "Ireland": "Irlande", "Israel": "Israël", "Italy": "Italie", "Ivory Coast": "Côte d'Ivoire", "Jamaica": "Jamaïque", "Japan": "Japon", "Jordan": "Jordanie", "Kazakhstan": "Kazakhstan", "Kenya": "Kenya", "Kiribati": "Kiribati", "Kosovo": "Kosovo", "Kuwait": "Koweït", "Kyrgyzstan": "Kirghizistan", "Laos": "Laos", "Latvia": "Lettonie", "Lebanon": "Liban", "Lesotho": "Lesotho", "Liberia": "Libéria", "Libya": "Libye", "Liechtenstein": "Liechtenstein", "Lithuania": "Lituanie", "Luxembourg": "Luxembourg", "Madagascar": "Madagascar", "Malawi": "Malawi", "Malaysia": "Malaisie", "Maldives": "Maldives", "Mali": "Mali", "Malta": "Malte", "Marshall Islands": "Îles Marshall", "Mauritania": "Mauritanie", "Mauritius": "Maurice", "Mexico": "Mexique", "Micronesia": "Micronésie", "Moldova": "Moldavie", "Monaco": "Monaco", "Mongolia": "Mongolie", "Montenegro": "Monténégro", "Morocco": "Maroc", "Mozambique": "Mozambique", "Myanmar": "Myanmar", "Namibia": "Namibie", "Nauru": "Nauru", "Nepal": "Népal", "Netherlands": "Pays-Bas", "New Zealand": "Nouvelle-Zélande", "Nicaragua": "Nicaragua", "Niger": "Niger", "Nigeria": "Nigéria", "North Korea": "Corée du Nord", "North Macedonia": "Macédoine du Nord", "Norway": "Norvège", "Oman": "Oman", "Pakistan": "Pakistan", "Palau": "Palaos", "Panama": "Panama", "Papua New Guinea": "Papouasie-Nouvelle-Guinée", "Paraguay": "Paraguay", "Peru": "Pérou", "Philippines": "Philippines", "Poland": "Pologne", "Portugal": "Portugal", "Qatar": "Qatar", "Republic of the Congo": "République du Congo", "Romania": "Roumanie", "Russia": "Russie", "Rwanda": "Rwanda", "Saint Kitts and Nevis": "Saint-Kitts-et-Nevis", "Saint Lucia": "Sainte-Lucie", "Saint Vincent and the Grenadines": "Saint-Vincent-et-les-Grenadines", "Samoa": "Samoa", "San Marino": "Saint-Marin", "Sao Tome and Principe": "Sao Tomé-et-Principe", "Saudi Arabia": "Arabie Saoudite", "Sierra Leone": "Sierra Leone", "Singapore": "Singapour", "Slovakia": "Slovaquie", "Slovenia": "Slovénie", "Solomon Islands": "Îles Salomon", "Somalia": "Somalie", "South Africa": "Afrique du Sud", "South Korea": "Corée du Sud", "South Sudan": "Soudan du Sud", "Spain": "Espagne", "Sri Lanka": "Sri Lanka", "Sudan": "Soudan", "Suriname": "Suriname", "Sweden": "Suède", "Switzerland": "Suisse", "Syria": "Syrie", "Tajikistan": "Tadjikistan", "Tanzania": "Tanzanie", "Thailand": "Thaïlande", "Timor-Leste": "Timor-Leste", "Togo": "Togo", "Tonga": "Tonga", "Trinidad and Tobago": "Trinité-et-Tobago", "Tunisia": "Tunisie", "Turkey": "Turquie", "Turkmenistan": "Turkménistan", "Tuvalu": "Tuvalu", "Uganda": "Ouganda", "Ukraine": "Ukraine", "United Arab Emirates": "Émirats arabes unis", "United Kingdom": "Royaume-Uni", "United States of America": "États-Unis d'Amérique", "Uruguay": "Uruguay", "Uzbekistan": "Ouzbékistan", "Vanuatu": "Vanuatu", "Vatican City": "Cité du Vatican", "Venezuela": "Venezuela", "Vietnam": "Vietnam", "Yemen": "Yémen", "Zambia": "Zambie", "Zimbabwe": "Zimbabwe"
    };

    // --- Data Lists (Standard English names, used for internal 'value' and logic) ---
    const qualifiedDogs = [
        "Affenpinscher", "American Akita", "Akita Inu", "American Bully", "American Staffordshire Terrier", "Beauceron", "Anatolian Shepherd", "Caucasian Shepherd Dog",
        "Old English Sheepdog (Bobtail)", "Boerboel", "Bull Terrier", "Bullmastiff", "Ca de Bou (Majorcan Mastiff)", "Cane Corso", "Dogo Argentino", 
        "Dogue de Bordeaux", "Doberman", "Fila Brasileiro", "Mastiff", "Neapolitan Mastiff", "Rottweiler", "Saint Bernard", "Staffordshire Bull Terrier", 
        "Tibetan Mastiff", "Tosa", "Boston Terrier", "English Bulldog", "French Bulldog", "Bernese Mountain Dog", "Bouvier des Flandres", "Bouvier des Ardennes",
        "Boxer", "Broholmer", "Brussels Griffon", "Cavalier King Charles Spaniel", "Chow Chow", "Dogue Canario (Presa Canario)", "Great Dane", 
        "Greater Swiss Mountain Dog", "Komondor", "Leonberger", "Pekingese", "Pug", "Pyrenean Mastiff", "Pyrenean Mountain Dog", "Shar Pei"
    ];

    const qualifiedCats = [
        "Bengal", "British Longhair", "British Shorthair", "Burmese", "Exotic Fold", "Exotic Shorthair", "Himalayan", "Persian", "Savannah", "Scottish Fold", "Selkirk Rex"
    ];

    const nacBreeds = [
        "Chinchilla", "Guinea Pig", "Ferret", "Gecko", "Lizard", "Salamander", "Domestic Rat", "Snake", "Turtle", "Others"
    ];
    
    // Updated Dog and Cat Lists
    const dogBreeds = [
        "Affenpinscher", "Airedale Terrier", "Akita Inu", "Alaskan Klee Kai", "Alaskan Malamute", "American Akita", "American Bully", "American Pit Bull Terrier", "American Staffordshire Terrier", 
        "Anatolian Shepherd", "Appenzeller Sennenhund", "Atlas Shepherd (Aidi)", "Australian Cattle Dog", "Australian Shepherd", "Australian Terrier", "Basenji", "Basset Hound", 
        "Beagle", 
        "Bearded Collie", "Beauceron", "Belgian Malinois", "Belgian Shepherd", "Bernese Mountain Dog", "Bichon Frise", "Bloodhound", "Blue Gascon", 
        "Boerboel", "Border Collie", "Border Terrier", "Borzoi", "Boston Terrier", "Bouvier des Ardennes", "Bouvier des Flandres", "Boxer", "Briard", 
        "Brittany Spaniel", "Broholmer", "Brussels Griffon", "Bull Terrier", "Bullmastiff", "Ca de Bou (Majorcan Mastiff)", "Cairn Terrier", "Cane Corso", 
        "Catalan Sheepdog", "Caucasian Shepherd Dog", "Cavalier King Charles Spaniel", "Chihuahua", "Chow Chow", "Cocker Spaniel", "Collie", "Coton de Tulear", 
        "Creole or Mangrove Shepherd", 
        "Czechoslovakian Wolfdog", "Dachshund", "Dalmatian", "Doberman", "Dogo Argentino", "Dogue Canario (Presa Canario)", 
        "Dogue de Bordeaux", "Dutch Smoushond (Kooikerhondje)", "English Bulldog", "English Pointer", "Fila Brasileiro", "Finnish Spitz", "Fox Terrier", 
        "French Bulldog", "French Foxhound", "American Foxhound", 
        "German Shepherd", "German Shorthaired Pointer", "German Wirehaired Pointer", 
        "German Spitz", "Golden Retriever", "Great Dane", "Greater Swiss Mountain Dog", "Greyhound", "Icelandic Sheepdog", "Italian Greyhound", 
        "Italian Spitz", "Jack Russell Terrier", "Japanese Spaniel (Japanese Chin)", "Japanese Spitz", "Japanese Terrier", "King Charles Spaniel", 
        "Komondor", "Kooikerhondje", 
        "Labrador Retriever", "Leonberger", "Lhasa Apso", "Maltese", "Mastiff", "Medium Poodle", "Toy Poodle", 
        "Mudi", "Neapolitan Mastiff", "Newfoundland", "Norfolk Terrier", "Old English Sheepdog (Bobtail)", "Pekingese", 
        "Picardy Shepherd", "Picardy Spaniel", 
        "Pinscher", "Pointer", "Polish Lowland Sheepdog", "Pomeranian", "Poodle", "Portuguese Shepherd", 
        "Portuguese Water Dog", "Pug", "Puli", "Pumi", 
        "Pyrenean Mastiff", "Pyrenean Mountain Dog", "Pyrenean Shepherd", "Rhodesian Ridgeback", "Rottweiler", 
        "Saint Bernard", "Saluki", "Samoyed", "Schnauzer", "Scottish Terrier", "Setter", "Shar Pei", "Shetland Sheepdog", "Shiba Inu", "Shih Tzu", 
        "Siberian Husky", "Silky Terrier", "Spanish Mastiff", "Spitz", "Staffordshire Bull Terrier", "Tibetan Mastiff", "Tibetan Spaniel", 
        "Tibetan Terrier", "Tosa", "Toy Terrier", "Weimaraner", "Welsh Corgi", "Welsh Terrier", "West Highland White Terrier", "Whippet", 
        "White Swiss Shepherd", "Yorkshire Terrier", "Others"
    ];

    const catBreeds = [
        "Abyssinian", "American Bobtail", "American Curl", "American Shorthair", "American Wirehair", "Turkish Angora", "Asian", "Australian Mist", 
        "Balinese", "Bengal", "Birman (Sacred Birman)", "Bohemian Rex", "Bombay", "British Longhair", "British Shorthair", "Burmese", "Burmilla", 
        "Californian Rex", "Chartreux", "Domestic Cat", "Norwegian Forest Cat", "Cornish Rex", "Siamese", "Cymric", "Devon Rex", "Donskoy (Don Sphynx)", 
        "Exotic Shorthair", "Exotic Fold", "German Rex", "Himalayan", "Highland Fold", "Korat", "Kurilian Bobtail", "LaPerm", "Lykoi", 
        "Maine Coon", "Manx", "Egyptian Mau", "Mekong Bobtail", "Munchkin", "Nebelung", "Neva Masquerade", "Ocicat", "Oriental", 
        "Persian", "Peterbald", "Ragamuffin", "Ragdoll", "Russian Blue", "Scottish Fold", "Selkirk Rex", "Savannah", "Siberian", 
        "Singapura", "Snowshoe", "Sokoke", "Somali", "Sphynx", "Thai", "Tiffanie", "Tonkinese", "Toyger", "Turkish Van", "European", 
        "Others"
    ];

    const breeds = {
         'Cat': catBreeds,
         'Dog': dogBreeds,
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

    const qualifiedCountries = [
        "France", "Mauritius", "Australia", "New Caledonia", "New Zealand", "South Africa",
        "Ireland", "Wallis and Futuna", "Bahrain", "Hong Kong", "Dubai", "United Kingdom",
        "French Polynesia"
    ];

    // --- DOM Elements & Initial Setup ---
    const page1 = document.getElementById('page-1');
    const page2 = document.getElementById('page-2');
    const page3 = document.getElementById('page-3');
    const page4 = document.getElementById('page-4');

    const addPetBtn = document.getElementById('add-pet-btn');
    const nextPage1Btn = document.getElementById('next-page-1-btn');
    const prevPage2Btn = document.getElementById('prev-page-2-btn');
    const nextPage2Btn = document.getElementById('next-page-2-btn');
    const prevPage3Btn = document.getElementById('prev-page-3-btn');
    const nextPage3Btn = document.getElementById('next-page-3-btn');
    const prevPage4Btn = document.getElementById('prev-page-4-btn');
    
    const langToggleBtn = document.getElementById('lang-toggle-btn');

    const petFormsContainer = document.getElementById('pet-forms-container');
    const form = document.getElementById('pet-form');

    const conditionalQuestion = document.getElementById('travel-options-group');
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

    // --- Language Update Function ---
    function updateContent(lang) {
        const t = translations[lang];

        // 1. Update static elements (with data-key)
        document.querySelectorAll('[data-key]').forEach(element => {
            const key = element.getAttribute('data-key');
            if (t[key]) {
                if (element.tagName === 'OPTION') {
                    element.textContent = t[key];
                } else if (element.tagName === 'BUTTON' || (element.tagName === 'INPUT' && element.type === 'submit')) {
                    element.textContent = t[key];
                } else {
                    element.textContent = t[key];
                }
            }
        });
        
        // 2. Update Country dropdowns
        const countrySelects = document.querySelectorAll('#departure-country, #destination-country');
        const countryMap = lang === 'fr' ? countryMap_fr : {}; // Use French map or empty map for English

        countrySelects.forEach(select => {
            select.querySelectorAll('option:not([data-key="select_country_option"])').forEach(option => {
                const englishValue = option.value;
                option.textContent = countryMap[englishValue] || englishValue;
            });
        });

        // 3. Update pet forms
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
            const petId = index + 1;
            const heading = petForm.querySelector('h4');
            if (heading) {
                heading.textContent = `${t.pet_heading} ${petId}`;
            }
            
            // Update static labels/buttons within the pet form
            petForm.querySelector('label[for^="animal-type"]').textContent = t.animal_type_label;
            const breedLabel = petForm.querySelector('label[for^="breed"]');
            if (breedLabel) breedLabel.textContent = t.breed_label;
            petForm.querySelector('label[for^="age"]').textContent = t.age_label;
            petForm.querySelector('label[for^="weight"]').textContent = t.weight_label;
            petForm.querySelector('.remove-pet-btn').textContent = t.remove_pet_btn;
            
            // Update Animal Type dropdown options
            const typeSelect = petForm.querySelector('select[name^="animal-type"]');
            if (typeSelect) {
                const defaultOption = typeSelect.querySelector('option[value=""]');
                if (defaultOption) defaultOption.textContent = t.choose_animal_type;
                
                typeSelect.querySelectorAll('option:not([value=""])').forEach(option => {
                    option.textContent = translateOption(option.value, currentLang);
                });
            }
            
            // Update Breed dropdown options
            const breedSelect = petForm.querySelector('select[name^="breed"]');
            if (breedSelect && breedSelect.children.length > 0) {
                 const defaultOption = breedSelect.querySelector('option[value=""]');
                 if (defaultOption) defaultOption.textContent = t.select_breed;
                 
                 breedSelect.querySelectorAll('option:not([value=""])').forEach(option => {
                    option.textContent = translateOption(option.value, currentLang);
                });
            }

            // Update Custom Specification Label dynamically
            const customSpecLabel = petForm.querySelector(`#custom-spec-label-${petId}`);
            if (customSpecLabel) {
                 if (typeSelect && typeSelect.value === 'Others') {
                     customSpecLabel.textContent = t.other_animal_label; // Type & Breed
                 } else if (breedSelect && breedSelect.value === 'Others') {
                     customSpecLabel.textContent = t.specify_breed_label; // Just Breed
                 }
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

            <div class="custom-specification-container" style="display: none;">
                <label for="custom-spec-${petIdCounter}" id="custom-spec-label-${petIdCounter}">${t.other_animal_label}</label>
                <input type="text" id="custom-spec-${petIdCounter}" name="custom-spec-${petIdCounter}">
            </div>

            <label for="age-${petIdCounter}">${t.age_label}</label>
            <input type="text" id="age-${petIdCounter}" name="age-${petIdCounter}" required>

            <label for="weight-${petIdCounter}">${t.weight_label}</label>
            <input type="text" id="weight-${petIdCounter}" name="weight-${petIdCounter}" required>
            
            <button type="button" class="remove-pet-btn">${t.remove_pet_btn}</button>
        `;

        petFormsContainer.appendChild(petForm);
        renumberPets();

        // DOM Elements for the new form instance
        const animalTypeSelect = petForm.querySelector(`#animal-type-${petIdCounter}`);
        const breedContainer = petForm.querySelector('.breed-container');
        const breedSelect = petForm.querySelector(`#breed-${petIdCounter}`);
        
        // Custom Specification Fields
        const customSpecContainer = petForm.querySelector('.custom-specification-container');
        const customSpecInput = petForm.querySelector(`#custom-spec-${petIdCounter}`);
        const customSpecLabel = petForm.querySelector(`#custom-spec-label-${petIdCounter}`);


        // Helper function to handle custom field visibility
        function updateCustomSpec(isCustom, isTypeOthers) {
            customSpecContainer.style.display = isCustom ? 'block' : 'none';
            customSpecInput.required = isCustom;
            if (isCustom) {
                // Dynamically change the label text
                customSpecLabel.textContent = isTypeOthers 
                    ? translations[currentLang].other_animal_label 
                    : translations[currentLang].specify_breed_label; 
            }
        }

        // --- 1. Animal Type Change Listener ---
        animalTypeSelect.addEventListener('change', (e) => {
            const selectedType = e.target.value;
            
            // Reset Breed UI
            breedContainer.style.display = 'none';
            breedSelect.required = false;
            breedSelect.innerHTML = '';
            
            // Reset Custom Spec UI
            updateCustomSpec(false, false);

            if (selectedType === 'Others') {
                // Case 1: Animal Type is 'Others'. Show custom input for Type & Breed.
                updateCustomSpec(true, true);
            } else if (selectedType && breeds[selectedType]) {
                // Case 2: Animal Type is specific (Dog, Cat, etc.). Populate breeds.
                
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
                
                // --- 2. Breed Change Listener (added here as the select is populated) ---
                breedSelect.addEventListener('change', () => {
                    if (breedSelect.value === 'Others') {
                        // Case 3: Breed is 'Others'. Show custom input for Breed only.
                        updateCustomSpec(true, false);
                    } else {
                        updateCustomSpec(false, false);
                    }
                });
            }
        });

        const numericInputs = petForm.querySelectorAll('input[name^="age"], input[name^="weight"]');
        numericInputs.forEach(input => {
            input.addEventListener('input', () => {
                if (input.name.startsWith('age')) {
                    input.value = input.value.replace(/[^0-9]/g, ''); // Allow only integers
                } else if (input.name.startsWith('weight')) {
                    let value = input.value;
                    value = value.replace(/[^0-9.]/g, ''); 
                    const parts = value.split('.');
                    if (parts.length > 2) {
                        value = parts[0] + '.' + parts.slice(1).join(''); 
                    }
                    input.value = value;
                }
            });
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

        // 1. General Required Check
        requiredInputs.forEach(input => {
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
            
            if (isVisible && (input.value === undefined || input.value.trim() === '')) {
                isValid = false;
                input.classList.add('error');
            } else {
                input.classList.remove('error');
            }
        });

        // 2. Specific Validation for Page 4 (Contact Info)
        if (pageElement.id === 'page-4') {
            const firstName = document.getElementById('first-name');
            const lastName = document.getElementById('last-name');
            const email = document.getElementById('email');
            const phone = document.getElementById('phone');

            // Regex: Letters, spaces, hyphens, apostrophes. No numbers.
            const nameRegex = /^[a-zA-Z\u00C0-\u00FF\s'-]+$/;
            
            if (firstName && !nameRegex.test(firstName.value.trim())) {
                isValid = false;
                firstName.classList.add('error');
            }
            if (lastName && !nameRegex.test(lastName.value.trim())) {
                isValid = false;
                lastName.classList.add('error');
            }

            // Simple Email Regex
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (email && !emailRegex.test(email.value.trim())) {
                isValid = false;
                email.classList.add('error');
            }

            // Phone Validation via intl-tel-input
            if (phone) {
                if (!phoneIti.isValidNumber()) {
                    isValid = false;
                    phone.classList.add('error');
                } else {
                    phone.classList.remove('error');
                }
            }
        }

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

    if (nextPage3Btn) {
        nextPage3Btn.addEventListener('click', () => {
            if (validatePage(page3)) {
                page3.style.display = 'none';
                page4.style.display = 'block';
            } else {
                alert(translations[currentLang].error_alert);
            }
        });
    }

    if (prevPage4Btn) {
        prevPage4Btn.addEventListener('click', () => {
            page4.style.display = 'none';
            page3.style.display = 'block';
        });
    }

    // --- Conditional Logic (Page 3) ---
    function checkQualification() {
        const destinationCountryElement = document.getElementById('destination-country');
        const destinationCountry = destinationCountryElement ? destinationCountryElement.value : '';
        const petForms = document.querySelectorAll('.pet-form');
        
        let isAtLeastOnePetQualified = false;

        petForms.forEach(petForm => {
            const animalTypeSelect = petForm.querySelector('select[name^="animal-type"]');
            const breedSelect = petForm.querySelector('select[name^="breed"]');
            
            const animalType = animalTypeSelect ? animalTypeSelect.value : '';
            const breed = breedSelect ? breedSelect.value : '';

            if (animalType === 'Dog' && qualifiedDogs.includes(breed)) {
                isAtLeastOnePetQualified = true;
            } 
            else if (animalType === 'Cat' && qualifiedCats.includes(breed)) {
                isAtLeastOnePetQualified = true;
            } 
            else if (['Bird', 'Rabbit', 'NAC'].includes(animalType)) {
                isAtLeastOnePetQualified = true;
            }
        });

        const isCountryQualified = qualifiedCountries.includes(destinationCountry);

        if (!isCountryQualified && !isAtLeastOnePetQualified) {
            conditionalQuestion.style.display = 'block';
            travelOption.required = true;
        } else {
            conditionalQuestion.style.display = 'none';
            travelOption.required = false;
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

        // Validate Page 4 fields before submitting
        if (!validatePage(page4)) {
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
            
            const customSpecValue = formData.get(`custom-spec-${id}`); 

            if (type === 'Others' || breedVal === 'Others') {
                breedVal = customSpecValue; 
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

        // Contact Information
        data['first-name'] = formData.get('first-name');
        data['last-name'] = formData.get('last-name');
        data['email'] = formData.get('email');
        // Get full international number from library instances
        data['phone'] = phoneIti.getNumber(); 
        data['whatsapp'] = whatsappInput.value ? whatsappIti.getNumber() : '';

        console.log('Sending:', data);

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = translations[currentLang].sending;

        try {
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
            window.location.reload(); 

        } catch (error) {
            console.error(error);
            alert(`${translations[currentLang].submit_failure} ${error.message}`);
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
        }
    });
});