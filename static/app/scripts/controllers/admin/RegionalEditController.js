/**
 * Created by Ghiboub khalid on 9/29/15.
 */

app.controller('RegionalEditCtrl', ['$scope', 'Auth', 'User',
    function ($scope, Auth, User) {
        $("ul.page-sidebar-menu li").removeClass("active");
        $("#id_Regional").addClass("active");
        $scope.isSignedIn = false;
        $scope.immediateFailed = false;
        $scope.isLoading = false;
        $scope.defaultLang = $scope.defaultLang;
        $scope.defaultCurrency = "USD";
        $scope.inProcess = function (varBool, message) {
            if (varBool) {
                if (message) {
                    console.log("starts of :" + message);
                }
                $scope.nbLoads = $scope.nbLoads + 1;
                if ($scope.nbLoads == 1) {
                    $scope.isLoading = true;
                }
            } else {
                if (message) {
                    console.log("ends of :" + message);
                }
                $scope.nbLoads = $scope.nbLoads - 1;
                if ($scope.nbLoads == 0) {
                    $scope.isLoading = false;
                }
            }
        };
        $scope.languages = {'en': 'English', 'fr': 'French', 'ar': 'Arabic'};
        $scope.getCurrencyFormat = function (countryCultureCode) {
            var number = 1234567.85;
            countryCultureCode = $scope.replaceUnderscoreByDash(countryCultureCode);
            return new Intl.NumberFormat(countryCultureCode).format(number); 
        };
        $scope.replaceUnderscoreByDash = function (lang) {
            if (lang) {
                if (lang.indexOf('_') != -1) lang = lang.replace(/_/g, '-');
                return lang
            }
            return lang;
        };
        $scope.replaceDashByUnderScore = function (lang) {
            if (lang.indexOf('-') != -1) lang = lang.replace(/-/g, '_');
            return lang
        };
        $scope.getDateFormat = function (countryCultureCode) {

            countryCultureCode = $scope.replaceUnderscoreByDash(countryCultureCode);
            var options = {
                year: 'numeric', month: 'numeric', day: 'numeric',
                hour: 'numeric', minute: 'numeric'
            };
            return new Intl.DateTimeFormat(countryCultureCode, options).format(new Date());
        };
        $scope.saveUser = function () {
            $scope.user.country_code = angular.element("#country_list").select2("val");
            $scope.user.language = angular.element("#language_picker").select2("val");
            $scope.user.timezone = angular.element("#timezone_picker").select2("val");
            $scope.user.date_time_format = angular.element("#date_time_format").select2("val");
            $scope.user.currency_format = angular.element("#currency_format").select2("val");
            $scope.user.currency = angular.element("#currency").select2("val");
            $scope.user.week_start = angular.element("#week_start").select2("val");
            User.patch($scope, $scope.user);
        };
        $scope.$watch('user', function () {
            if ($scope.user) {
                angular.element("#country_list").select2("val", $scope.user.country_code || 'US');
                angular.element("#language_picker").select2("val", $scope.user.language || 'US');
                angular.element("#timezone_picker").select2("val", $scope.user.timezone || 'US');
                angular.element("#date_time_format").select2("val", $scope.user.date_time_format);
                angular.element("#currency_format").select2("val", $scope.user.currency_format);
                angular.element("#currency").select2("val", $scope.user.currency);
                angular.element("#week_start").select2("val", $scope.user.week_start);
            }
        });
        $scope.getCurrentTimeZone = function () {
            var offset = new Date().getTimezoneOffset(), o = Math.abs(offset);
            return (offset < 0 ? "+" : "-") + ("00" + Math.floor(o / 60)).slice(-2) + ":" + ("00" + (o % 60)).slice(-2);
        };

        $scope.resetToDefault = function () {
            var navLang = navigator.language || navigator.userLanguage || $scope.defaultLang;
            var userLang = $scope.replaceDashByUnderScore(navLang);
            var timeZone = $scope.getCurrentTimeZone();
            var split = navLang.split('-');
            var lang = split[0];
            var country = split[1];
            angular.element("#timezone_picker").select2("val", timeZone);
            angular.element("#date_time_format").select2("val", userLang);
            angular.element("#currency_format").select2("val", userLang);
            angular.element("#week_start").select2("val", 'monday');
            angular.element("#language_picker").select2("val", lang);
            angular.element("#country_list").select2("val", country);
            angular.element("#currency").select2("val", $scope.defaultCurrency);
        };

        $scope.languagesCodes = {
            'af_NA': "Afrikaans (Namibia)",
            'af_ZA': "Afrikaans (South Africa)",
            'af': "Afrikaans",
            'ak_GH': "Akan (Ghana)",
            'ak': "Akan",
            'sq_AL': 'Albanian (Albania)',
            'sq': "Albanian",
            'am_ET': "Amharic (Ethiopia)",
            'am': "Amharic",
            'fr_al': "Algeria",
            'ar_BH': "Arabic (Bahrain)",
            'ar_EG': "Arabic (Egypt)",
            'ar_IQ': "Arabic (Iraq)",
            'ar_JO': "Arabic (Jordan)",
            'ar_KW': "Arabic (Kuwait)",
            'ar_LB': "Arabic (Lebanon)",
            'ar_LY': "Arabic (Libya)",
            'fr_mo': "Morocco",
            'ar_OM': "Arabic (Oman)",
            'ar_QA': "Arabic (Qatar)",
            'ar_SA': "Arabic (Saudi Arabia)",
            'ar_SD': "Arabic (Sudan)",
            'ar_SY': "Arabic (Syria)",
            'fr_tu': "Tunisia",
            'ar_AE': "Arabic (United Arab Emirates)",
            'ar_YE': "Arabic (Yemen)",
            'ar': "Arabic",
            'hy_AM': "Armenian (Armenia)",
            'hy': "Armenian",
            'as_IN': "Assamese (India)",
            'as': "Assamese",
            'asa_TZ': "Asu (Tanzania)",
            'asa': "Asu",
            'az_Cyrl': "Azerbaijani (Cyrillic)",
            'az_Cyrl_AZ': "Azerbaijani (Cyrillic, Azerbaijan)",
            'az_Latn': "Azerbaijani (Latin)",
            'az_Latn_AZ': "Azerbaijani (Latin, Azerbaijan)",
            'az': "Azerbaijani",
            'bm_ML': "Bambara (Mali)",
            'bm': "Bambara",
            'eu_ES': "Basque (Spain)",
            'eu': "Basque",
            'be_BY': "Belarusian (Belarus)",
            'be': "Belarusian",
            'bem_ZM': "Bemba (Zambia)",
            'bem': "Bemba",
            'bez_TZ': "Bena (Tanzania)",
            'bez': "Bena",
            'bn_BD': "Bengali (Bangladesh)",
            'bn_IN': "Bengali (India)",
            'bn': "Bengali",
            'bs_BA': "Bosnian (Bosnia and Herzegovina)",
            'bs': "Bosnian",
            'bg_BG': "Bulgarian (Bulgaria)",
            'bg': "Bulgarian",
            'my_MM': "Burmese (Myanmar [Burma])",
            'my': "Burmese",
            'ca_ES': "Catalan (Spain)",
            'ca': "Catalan",
            'tzm_Latn': "Central Morocco Tamazight (Latin)",
            'tzm_Latn_MA': "Central Morocco Tamazight (Latin, Morocco)",
            'tzm': "Central Morocco Tamazight",
            'chr_US': "Cherokee (United States)",
            'chr': "Cherokee",
            'cgg_UG': "Chiga (Uganda)",
            'cgg': "Chiga",
            'zh_Hans': "Chinese (Simplified Han)",
            'zh_Hans_CN': "Chinese (Simplified Han, China)",
            'zh_Hans_HK': "Chinese (Simplified Han, Hong Kong SAR China)",
            'zh_Hans_MO': "Chinese (Simplified Han, Macau SAR China)",
            'zh_Hans_SG': "Chinese (Simplified Han, Singapore)",
            'zh_Hant': "Chinese (Traditional Han)",
            'zh_Hant_HK': "Chinese (Traditional Han, Hong Kong SAR China)",
            'zh_Hant_MO': "Chinese (Traditional Han, Macau SAR China)",
            'zh_Hant_TW': "Chinese (Traditional Han, Taiwan)",
            'zh': "Chinese",
            'kw_GB': "Cornish (United Kingdom)",
            'kw': "Cornish",
            'hr_HR': "Croatian (Croatia)",
            'hr': "Croatian",
            'cs_CZ': "Czech (Czech Republic)",
            'cs': "Czech",
            'da_DK': "Danish (Denmark)",
            'da': "Danish",
            'nl_BE': "Dutch (Belgium)",
            'nl_NL': "Dutch (Netherlands)",
            'nl': "Dutch",
            'ebu_KE': "Embu (Kenya)",
            'ebu': "Embu",
            'en_AS': "English (American Samoa)",
            'en_AU': "English (Australia)",
            'en_BE': "English (Belgium)",
            'en_BZ': "English (Belize)",
            'en_BW': "English (Botswana)",
            'en_CA': "English (Canada)",
            'en_GU': "English (Guam)",
            'en_HK': "English (Hong Kong SAR China)",
            'en_IN': "English (India)",
            'en_IE': "English (Ireland)",
            'en_JM': "English (Jamaica)",
            'en_MT': "English (Malta)",
            'en_MH': "English (Marshall Islands)",
            'en_MU': "English (Mauritius)",
            'en_NA': "English (Namibia)",
            'en_NZ': "English (New Zealand)",
            'en_MP': "English (Northern Mariana Islands)",
            'en_PK': "English (Pakistan)",
            'en_PH': "English (Philippines)",
            'en_SG': "English (Singapore)",
            'en_ZA': "English (South Africa)",
            'en_TT': "English (Trinidad and Tobago)",
            'en_UM': "English (U.S. Minor Outlying Islands)",
            'en_VI': "English (U.S. Virgin Islands)",
            'en_GB': "English (United Kingdom)",
            'en_US': "English (United States)",
            'en_ZW': "English (Zimbabwe)",
            'en': "English",
            'eo': "Esperanto",
            'et_EE': "Estonian (Estonia)",
            'et': "Estonian",
            'ee_GH': "Ewe (Ghana)",
            'ee_TG': "Ewe (Togo)",
            'ee': "Ewe",
            'fo_FO': "Faroese (Faroe Islands)",
            'fo': "Faroese",
            'fil_PH': "Filipino (Philippines)",
            'fil': "Filipino",
            'fi_FI': "Finnish (Finland)",
            'fi': "Finnish",
            'fr_BE': "French (Belgium)",
            'fr_BJ': "French (Benin)",
            'fr_BF': "French (Burkina Faso)",
            'fr_BI': "French (Burundi)",
            'fr_CM': "French (Cameroon)",
            'fr_CA': "French (Canada)",
            'fr_CF': "French (Central African Republic)",
            'fr_TD': "French (Chad)",
            'fr_KM': "French (Comoros)",
            'fr_CG': "French (Congo _ Brazzaville)",
            'fr_CD': "French (Congo _ Kinshasa)",
            'fr_CI': "French (Côte d’Ivoire)",
            'fr_DJ': "French (Djibouti)",
            'fr_GQ': "French (Equatorial Guinea)",
            'fr_FR': "French (France)",
            'fr_GA': "French (Gabon)",
            'fr_GP': "French (Guadeloupe)",
            'fr_GN': "French (Guinea)",
            'fr_LU': "French (Luxembourg)",
            'fr_MG': "French (Madagascar)",
            'fr_ML': "French (Mali)",
            'fr_MQ': "French (Martinique)",
            'fr_MC': "French (Monaco)",
            'fr_NE': "French (Niger)",
            'fr_RW': "French (Rwanda)",
            'fr_RE': "French (Réunion)",
            'fr_BL': "French (Saint Barthélemy)",
            'fr_MF': "French (Saint Martin)",
            'fr_SN': "French (Senegal)",
            'fr_CH': "French (Switzerland)",
            'fr_TG': "French (Togo)",
            'fr': "French",
            'ff_SN': "Fulah (Senegal)",
            'ff': "Fulah",
            'gl_ES': "Galician (Spain)",
            'gl': "Galician",
            'lg_UG': "Ganda (Uganda)",
            'lg': "Ganda",
            'ka_GE': "Georgian (Georgia)",
            'ka': "Georgian",
            'de_AT': "German (Austria)",
            'de_BE': "German (Belgium)",
            'de_DE': "German (Germany)",
            'de_LI': "German (Liechtenstein)",
            'de_LU': "German (Luxembourg)",
            'de_CH': "German (Switzerland)",
            'de': "German",
            'el_CY': "Greek (Cyprus)",
            'el_GR': "Greek (Greece)",
            'el': "Greek",
            'gu_IN': "Gujarati (India)",
            'gu': "Gujarati",
            'guz_KE': "Gusii (Kenya)",
            'guz': "Gusii",
            'ha_Latn': "Hausa (Latin)",
            'ha_Latn_GH': "Hausa (Latin, Ghana)",
            'ha_Latn_NE': "Hausa (Latin, Niger)",
            'ha_Latn_NG': "Hausa (Latin, Nigeria)",
            'ha': "Hausa",
            'haw_US': "Hawaiian (United States)",
            'haw': "Hawaiian",
            'he_IL': "Hebrew (Israel)",
            'he': "Hebrew",
            'hi_IN': "Hindi (India)",
            'hi': "Hindi",
            'hu_HU': "Hungarian (Hungary)",
            'hu': "Hungarian",
            'is_IS': "Icelandic (Iceland)",
            'is': "Icelandic",
            'ig_NG': "Igbo (Nigeria)",
            'ig': "Igbo",
            'id_ID': "Indonesian (Indonesia)",
            'id': "Indonesian",
            'ga_IE': "Irish (Ireland)",
            'ga': "Irish",
            'it_IT': "Italian (Italy)",
            'it_CH': "Italian (Switzerland)",
            'it': "Italian",
            'ja_JP': "Japanese (Japan)",
            'ja': "Japanese",
            'kea_CV': "Kabuverdianu (Cape Verde)",
            'kea': "Kabuverdianu",
            'kl_GL': "Kalaallisut (Greenland)",
            'kl': "Kalaallisut",
            'kln_KE': "Kalenjin (Kenya)",
            'kln': "Kalenjin",
            'kam_KE': "Kamba (Kenya)",
            'kam': "Kamba",
            'kn_IN': "Kannada (India)",
            'kn': "Kannada",
            'kk_Cyrl': "Kazakh (Cyrillic)",
            'kk_Cyrl_KZ': "Kazakh (Cyrillic, Kazakhstan)",
            'kk': "Kazakh",
            'km_KH': "Khmer (Cambodia)",
            'km': "Khmer",
            'ki_KE': "Kikuyu (Kenya)",
            'ki': "Kikuyu",
            'rw_RW': "Kinyarwanda (Rwanda)",
            'rw': "Kinyarwanda",
            'kok_IN': "Konkani (India)",
            'kok': "Konkani",
            'ko_KR': "Korean (South Korea)",
            'ko': "Korean",
            'khq_ML': "Koyra Chiini (Mali)",
            'khq': "Koyra Chiini",
            'ses_ML': "Koyraboro Senni (Mali)",
            'ses': "Koyraboro Senni",
            'lag_TZ': "Langi (Tanzania)",
            'lag': "Langi",
            'lv_LV': "Latvian (Latvia)",
            'lv': "Latvian",
            'lt_LT': "Lithuanian (Lithuania)",
            'lt': "Lithuanian",
            'luo_KE': "Luo (Kenya)",
            'luo': "Luo",
            'luy_KE': "Luyia (Kenya)",
            'luy': "Luyia",
            'mk_MK': "Macedonian (Macedonia)",
            'mk': "Macedonian",
            'jmc_TZ': "Machame (Tanzania)",
            'jmc': "Machame",
            'kde_TZ': "Makonde (Tanzania)",
            'kde': "Makonde",
            'mg_MG': "Malagasy (Madagascar)",
            'mg': "Malagasy",
            'ms_BN': "Malay (Brunei)",
            'ms_MY': "Malay (Malaysia)",
            'ms': "Malay",
            'ml_IN': "Malayalam (India)",
            'ml': "Malayalam",
            'mt_MT': "Maltese (Malta)",
            'mt': "Maltese",
            'gv_GB': "Manx (United Kingdom)",
            'gv': "Manx",
            'mr_IN': "Marathi (India)",
            'mr': "Marathi",
            'mas_KE': "Masai (Kenya)",
            'mas_TZ': "Masai (Tanzania)",
            'mas': "Masai",
            'mer_KE': "Meru (Kenya)",
            'mer': "Meru",
            'mfe_MU': "Morisyen (Mauritius)",
            'mfe': "Morisyen",
            'naq_NA': "Nama (Namibia)",
            'naq': "Nama",
            'ne_IN': "Nepali (India)",
            'ne_NP': "Nepali (Nepal)",
            'ne': "Nepali",
            'nd_ZW': "North Ndebele (Zimbabwe)",
            'nd': "North Ndebele",
            'nb_NO': "Norwegian Bokmål (Norway)",
            'nb': "Norwegian Bokmål",
            'nn_NO': "Norwegian Nynorsk (Norway)",
            'nn': "Norwegian Nynorsk",
            'nyn_UG': "Nyankole (Uganda)",
            'nyn': "Nyankole",
            'or_IN': "Oriya (India)",
            'or': "Oriya",
            'om_ET': "Oromo (Ethiopia)",
            'om_KE': "Oromo (Kenya)",
            'om': "Oromo",
            'ps_AF': "Pashto (Afghanistan)",
            'ps': "Pashto",
            'fa_AF': "Persian (Afghanistan)",
            'fa_IR': "Persian (Iran)",
            'fa': "Persian",
            'pl_PL': "Polish (Poland)",
            'pl': "Polish",
            'pt_BR': "Portuguese (Brazil)",
            'pt_GW': "Portuguese (Guinea_Bissau)",
            'pt_MZ': "Portuguese (Mozambique)",
            'pt_PT': "Portuguese (Portugal)",
            'pt': "Portuguese",
            'pa_Arab': "Punjabi (Arabic)",
            'pa_Arab_PK': "Punjabi (Arabic, Pakistan)",
            'pa_Guru': "Punjabi (Gurmukhi)",
            'pa_Guru_IN': "Punjabi (Gurmukhi, India)",
            'pa': "Punjabi",
            'ro_MD': "Romanian (Moldova)",
            'ro_RO': "Romanian (Romania)",
            'ro': "Romanian",
            'rm_CH': "Romansh (Switzerland)",
            'rm': "Romansh",
            'rof_TZ': "Rombo (Tanzania)",
            'rof': "Rombo",
            'ru_MD': "Russian (Moldova)",
            'ru_RU': "Russian (Russia)",
            'ru_UA': "Russian (Ukraine)",
            'ru': "Russian",
            'rwk_TZ': "Rwa (Tanzania)",
            'rwk': "Rwa",
            'saq_KE': "Samburu (Kenya)",
            'saq': "Samburu",
            'sg_CF': "Sango (Central African Republic)",
            'sg': "Sango",
            'seh_MZ': "Sena (Mozambique)",
            'seh': "Sena",
            'sr_Cyrl': "Serbian (Cyrillic)",
            'sr_Cyrl_BA': "Serbian (Cyrillic, Bosnia and Herzegovina)",
            'sr_Cyrl_ME': "Serbian (Cyrillic, Montenegro)",
            'sr_Cyrl_RS': "Serbian (Cyrillic, Serbia)",
            'sr_Latn': "Serbian (Latin)",
            'sr_Latn_BA': "Serbian (Latin, Bosnia and Herzegovina)",
            'sr_Latn_ME': "Serbian (Latin, Montenegro)",
            'sr_Latn_RS': "Serbian (Latin, Serbia)",
            'sr': "Serbian",
            'sn_ZW': "Shona (Zimbabwe)",
            'sn': "Shona",
            'ii_CN': "Sichuan Yi (China)",
            'ii': "Sichuan Yi",
            'si_LK': "Sinhala (Sri Lanka)",
            'si': "Sinhala",
            'sk_SK': "Slovak (Slovakia)",
            'sk': "Slovak",
            'sl_SI': "Slovenian (Slovenia)",
            'sl': "Slovenian",
            'xog_UG': "Soga (Uganda)",
            'xog': "Soga",
            'so_DJ': "Somali (Djibouti)",
            'so_ET': "Somali (Ethiopia)",
            'so_KE': "Somali (Kenya)",
            'so_SO': "Somali (Somalia)",
            'so': "Somali",
            'es_AR': "Spanish (Argentina)",
            'es_BO': "Spanish (Bolivia)",
            'es_CL': "Spanish (Chile)",
            'es_CO': "Spanish (Colombia)",
            'es_CR': "Spanish (Costa Rica)",
            'es_DO': "Spanish (Dominican Republic)",
            'es_EC': "Spanish (Ecuador)",
            'es_SV': "Spanish (El Salvador)",
            'es_GQ': "Spanish (Equatorial Guinea)",
            'es_GT': "Spanish (Guatemala)",
            'es_HN': "Spanish (Honduras)",
            'es_419': "Spanish (Latin America)",
            'es_MX': "Spanish (Mexico)",
            'es_NI': "Spanish (Nicaragua)",
            'es_PA': "Spanish (Panama)",
            'es_PY': "Spanish (Paraguay)",
            'es_PE': "Spanish (Peru)",
            'es_PR': "Spanish (Puerto Rico)",
            'es_ES': "Spanish (Spain)",
            'es_US': "Spanish (United States)",
            'es_UY': "Spanish (Uruguay)",
            'es_VE': "Spanish (Venezuela)",
            'es': "Spanish",
            'sw_KE': "Swahili (Kenya)",
            'sw_TZ': "Swahili (Tanzania)",
            'sw': "Swahili",
            'sv_FI': "Swedish (Finland)",
            'sv_SE': "Swedish (Sweden)",
            'sv': "Swedish",
            'gsw_CH': "Swiss German (Switzerland)",
            'gsw': "Swiss German",
            'shi_Latn': "Tachelhit (Latin)",
            'shi_Latn_MA': "Tachelhit (Latin, Morocco)",
            'shi_Tfng': "Tachelhit (Tifinagh)",
            'shi_Tfng_MA': "Tachelhit (Tifinagh, Morocco)",
            'shi': "Tachelhit",
            'dav_KE': "Taita (Kenya)",
            'dav': "Taita",
            'ta_IN': "Tamil (India)",
            'ta_LK': "Tamil (Sri Lanka)",
            'ta': "Tamil",
            'te_IN': "Telugu (India)",
            'te': "Telugu",
            'teo_KE': "Teso (Kenya)",
            'teo_UG': "Teso (Uganda)",
            'teo': "Teso",
            'th_TH': "Thai (Thailand)",
            'th': "Thai",
            'bo_CN': "Tibetan (China)",
            'bo_IN': "Tibetan (India)",
            'bo': "Tibetan",
            'ti_ER': "Tigrinya (Eritrea)",
            'ti_ET': "Tigrinya (Ethiopia)",
            'ti': "Tigrinya",
            'to_TO': "Tonga (Tonga)",
            'to': "Tonga",
            'tr_TR': "Turkish (Turkey)",
            'tr': "Turkish",
            'uk_UA': "Ukrainian (Ukraine)",
            'uk': "Ukrainian",
            'ur_IN': "Urdu (India)",
            'ur_PK': "Urdu (Pakistan)",
            'ur': "Urdu",
            'uz_Arab': "Uzbek (Arabic)",
            'uz_Arab_AF': "Uzbek (Arabic, Afghanistan)",
            'uz_Cyrl': "Uzbek (Cyrillic)",
            'uz_Cyrl_UZ': "Uzbek (Cyrillic, Uzbekistan)",
            'uz_Latn': "Uzbek (Latin)",
            'uz_Latn_UZ': "Uzbek (Latin, Uzbekistan)",
            'uz': "Uzbek",
            'vi_VN': "Vietnamese (Vietnam)",
            'vi': "Vietnamese",
            'vun_TZ': "Vunjo (Tanzania)",
            'vun': "Vunjo",
            'cy_GB': "Welsh (United Kingdom)",
            'cy': "Welsh",
            'yo_NG': "Yoruba (Nigeria)",
            'yo': "Yoruba",
            'zu_ZA': "Zulu (South Africa)",
            'zu': "Zulu"
        };
        $scope.contriesCodes = [
            {name: 'Afghanistan', code: 'AF'},
            //{name: 'Åland Islands', code: 'AX'},
            {name: 'Albania', code: 'AL'},
            {name: 'Algeria', code: 'DZ'},
            {name: 'American Samoa', code: 'AS'},
            {name: 'AndorrA', code: 'AD'},
            {name: 'Angola', code: 'AO'},
            {name: 'Anguilla', code: 'AI'},
            {name: 'Antarctica', code: 'AQ'},
            {name: 'Antigua and Barbuda', code: 'AG'},
            {name: 'Argentina', code: 'AR'},
            {name: 'Armenia', code: 'AM'},
            {name: 'Aruba', code: 'AW'},
            {name: 'Australia', code: 'AU'},
            {name: 'Austria', code: 'AT'},
            {name: 'Azerbaijan', code: 'AZ'},
            {name: 'Bahamas', code: 'BS'},
            {name: 'Bahrain', code: 'BH'},
            {name: 'Bangladesh', code: 'BD'},
            {name: 'Barbados', code: 'BB'},
            {name: 'Belarus', code: 'BY'},
            {name: 'Belgium', code: 'BE'},
            {name: 'Belize', code: 'BZ'},
            {name: 'Benin', code: 'BJ'},
            {name: 'Bermuda', code: 'BM'},
            {name: 'Bhutan', code: 'BT'},
            {name: 'Bolivia', code: 'BO'},
            {name: 'Bosnia and Herzegovina', code: 'BA'},
            {name: 'Botswana', code: 'BW'},
            //{name: 'Bouvet Island', code: 'BV'},
            {name: 'Brazil', code: 'BR'},
            //{name: 'British Indian Ocean Territory', code: 'IO'},
            {name: 'Brunei Darussalam', code: 'BN'},
            {name: 'Bulgaria', code: 'BG'},
            {name: 'Burkina Faso', code: 'BF'},
            {name: 'Burundi', code: 'BI'},
            {name: 'Cambodia', code: 'KH'},
            {name: 'Cameroon', code: 'CM'},
            {name: 'Canada', code: 'CA'},
            {name: 'Cape Verde', code: 'CV'},
            {name: 'Cayman Islands', code: 'KY'},
            {name: 'Central African Republic', code: 'CF'},
            {name: 'Chad', code: 'TD'},
            {name: 'Chile', code: 'CL'},
            {name: 'China', code: 'CN'},
            //{name: 'Christmas Island', code: 'CX'},
            //{name: 'Cocos (Keeling) Islands', code: 'CC'},
            {name: 'Colombia', code: 'CO'},
            {name: 'Comoros', code: 'KM'},
            {name: 'Congo', code: 'CG'},
            {name: 'Congo, The Democratic Republic of the', code: 'CD'},
            {name: 'Cook Islands', code: 'CK'},
            {name: 'Costa Rica', code: 'CR'},
            {name: 'Cote D\'Ivoire', code: 'CI'},
            {name: 'Croatia', code: 'HR'},
            {name: 'Cuba', code: 'CU'},
            {name: 'Cyprus', code: 'CY'},
            {name: 'Czech Republic', code: 'CZ'},
            {name: 'Denmark', code: 'DK'},
            {name: 'Djibouti', code: 'DJ'},
            {name: 'Dominica', code: 'DM'},
            {name: 'Dominican Republic', code: 'DO'},
            {name: 'Ecuador', code: 'EC'},
            {name: 'Egypt', code: 'EG'},
            {name: 'El Salvador', code: 'SV'},
            {name: 'Equatorial Guinea', code: 'GQ'},
            {name: 'Eritrea', code: 'ER'},
            {name: 'Estonia', code: 'EE'},
            {name: 'Ethiopia', code: 'ET'},
            //{name: 'Falkland Islands (Malvinas)', code: 'FK'},
            {name: 'Faroe Islands', code: 'FO'},
            {name: 'Fiji', code: 'FJ'},
            {name: 'Finland', code: 'FI'},
            {name: 'France', code: 'FR'},
            //{name: 'French Guiana', code: 'GF'},
            {name: 'French Polynesia', code: 'PF'},
            //{name: 'French Southern Territories', code: 'TF'},
            {name: 'Gabon', code: 'GA'},
            {name: 'Gambia', code: 'GM'},
            {name: 'Georgia', code: 'GE'},
            {name: 'Germany', code: 'DE'},
            {name: 'Ghana', code: 'GH'},
            {name: 'Gibraltar', code: 'GI'},
            {name: 'Greece', code: 'GR'},
            {name: 'Greenland', code: 'GL'},
            {name: 'Grenada', code: 'GD'},
            {name: 'Guadeloupe', code: 'GP'},
            {name: 'Guam', code: 'GU'},
            {name: 'Guatemala', code: 'GT'},
            {name: 'Guernsey', code: 'GG'},
            {name: 'Guinea', code: 'GN'},
            {name: 'Guinea-Bissau', code: 'GW'},
            {name: 'Guyana', code: 'GY'},
            {name: 'Haiti', code: 'HT'},
            //{name: 'Heard Island and Mcdonald Islands', code: 'HM'},
            {name: 'Holy See (Vatican City State)', code: 'VA'},
            {name: 'Honduras', code: 'HN'},
            {name: 'Hong Kong', code: 'HK'},
            {name: 'Hungary', code: 'HU'},
            {name: 'Iceland', code: 'IS'},
            {name: 'India', code: 'IN'},
            {name: 'Indonesia', code: 'ID'},
            {name: 'Iran, Islamic Republic Of', code: 'IR'},
            {name: 'Iraq', code: 'IQ'},
            {name: 'Ireland', code: 'IE'},
            {name: 'Isle of Man', code: 'IM'},
            {name: 'Israel', code: 'IL'},
            {name: 'Italy', code: 'IT'},
            {name: 'Jamaica', code: 'JM'},
            {name: 'Japan', code: 'JP'},
            {name: 'Jersey', code: 'JE'},
            {name: 'Jordan', code: 'JO'},
            {name: 'Kazakhstan', code: 'KZ'},
            {name: 'Kenya', code: 'KE'},
            {name: 'Kiribati', code: 'KI'},
            {name: 'Korea, Democratic People\'S Republic of', code: 'KP'},
            {name: 'Korea, Republic of', code: 'KR'},
            {name: 'Kuwait', code: 'KW'},
            {name: 'Kyrgyzstan', code: 'KG'},
            {name: 'Lao People\'S Democratic Republic', code: 'LA'},
            {name: 'Latvia', code: 'LV'},
            {name: 'Lebanon', code: 'LB'},
            {name: 'Lesotho', code: 'LS'},
            {name: 'Liberia', code: 'LR'},
            {name: 'Libyan Arab Jamahiriya', code: 'LY'},
            {name: 'Liechtenstein', code: 'LI'},
            {name: 'Lithuania', code: 'LT'},
            {name: 'Luxembourg', code: 'LU'},
            {name: 'Macao', code: 'MO'},
            {name: 'Macedonia, The Former Yugoslav Republic of', code: 'MK'},
            {name: 'Madagascar', code: 'MG'},
            {name: 'Malawi', code: 'MW'},
            {name: 'Malaysia', code: 'MY'},
            {name: 'Maldives', code: 'MV'},
            {name: 'Mali', code: 'ML'},
            {name: 'Malta', code: 'MT'},
            {name: 'Marshall Islands', code: 'MH'},
            {name: 'Martinique', code: 'MQ'},
            {name: 'Mauritania', code: 'MR'},
            {name: 'Mauritius', code: 'MU'},
            //{name: 'Mayotte', code: 'YT'},
            {name: 'Mexico', code: 'MX'},
            {name: 'Micronesia, Federated States of', code: 'FM'},
            {name: 'Moldova, Republic of', code: 'MD'},
            {name: 'Monaco', code: 'MC'},
            {name: 'Mongolia', code: 'MN'},
            {name: 'Montserrat', code: 'MS'},
            {name: 'Morocco', code: 'MA'},
            {name: 'Mozambique', code: 'MZ'},
            {name: 'Myanmar', code: 'MM'},
            {name: 'Namibia', code: 'NA'},
            {name: 'Nauru', code: 'NR'},
            {name: 'Nepal', code: 'NP'},
            {name: 'Netherlands', code: 'NL'},
            {name: 'Netherlands Antilles', code: 'AN'},
            {name: 'New Caledonia', code: 'NC'},
            {name: 'New Zealand', code: 'NZ'},
            {name: 'Nicaragua', code: 'NI'},
            {name: 'Niger', code: 'NE'},
            {name: 'Nigeria', code: 'NG'},
            //{name: 'Niue', code: 'NU'},
            //{name: 'Norfolk Island', code: 'NF'},
           // {name: 'Northern Mariana Islands', code: 'MP'},
            {name: 'Norway', code: 'NO'},
            {name: 'Oman', code: 'OM'},
            {name: 'Pakistan', code: 'PK'},
            {name: 'Palau', code: 'PW'},
            {name: 'Palestinian Territory, Occupied', code: 'PS'},
            {name: 'Panama', code: 'PA'},
            {name: 'Papua New Guinea', code: 'PG'},
            {name: 'Paraguay', code: 'PY'},
            {name: 'Peru', code: 'PE'},
            {name: 'Philippines', code: 'PH'},
            //{name: 'Pitcairn', code: 'PN'},
            {name: 'Poland', code: 'PL'},
            {name: 'Portugal', code: 'PT'},
            {name: 'Puerto Rico', code: 'PR'},
            {name: 'Qatar', code: 'QA'},
            {name: 'Reunion', code: 'RE'},
            {name: 'Romania', code: 'RO'},
            {name: 'Russian Federation', code: 'RU'},
            {name: 'RWANDA', code: 'RW'},
            //{name: 'Saint Helena', code: 'SH'},
            {name: 'Saint Kitts and Nevis', code: 'KN'},
            {name: 'Saint Lucia', code: 'LC'},
            //{name: 'Saint Pierre and Miquelon', code: 'PM'},
            {name: 'Saint Vincent and the Grenadines', code: 'VC'},
            {name: 'Samoa', code: 'WS'},
            {name: 'San Marino', code: 'SM'},
            {name: 'Sao Tome and Principe', code: 'ST'},
            {name: 'Saudi Arabia', code: 'SA'},
            {name: 'Senegal', code: 'SN'},
            //{name: 'Serbia and Montenegro', code: 'CS'},
            {name: 'Seychelles', code: 'SC'},
            {name: 'Sierra Leone', code: 'SL'},
            {name: 'Singapore', code: 'SG'},
            {name: 'Slovakia', code: 'SK'},
            {name: 'Slovenia', code: 'SI'},
            {name: 'Solomon Islands', code: 'SB'},
            {name: 'Somalia', code: 'SO'},
            {name: 'South Africa', code: 'ZA'},
            //{name: 'South Georgia and the South Sandwich Islands', code: 'GS'},
            {name: 'Spain', code: 'ES'},
            {name: 'Sri Lanka', code: 'LK'},
            {name: 'Sudan', code: 'SD'},
            {name: 'Suriname', code: 'SR'},
            //{name: 'Svalbard and Jan Mayen', code: 'SJ'},
            {name: 'Swaziland', code: 'SZ'},
            {name: 'Sweden', code: 'SE'},
            {name: 'Switzerland', code: 'CH'},
            {name: 'Syrian Arab Republic', code: 'SY'},
            {name: 'Taiwan, Province of China', code: 'TW'},
            {name: 'Tajikistan', code: 'TJ'},
            {name: 'Tanzania, United Republic of', code: 'TZ'},
            {name: 'Thailand', code: 'TH'},
            {name: 'Timor-Leste', code: 'TL'},
            {name: 'Togo', code: 'TG'},
            //{name: 'Tokelau', code: 'TK'},
            {name: 'Tonga', code: 'TO'},
            {name: 'Trinidad and Tobago', code: 'TT'},
            {name: 'Tunisia', code: 'TN'},
            {name: 'Turkey', code: 'TR'},
            {name: 'Turkmenistan', code: 'TM'},
            {name: 'Turks and Caicos Islands', code: 'TC'},
            {name: 'Tuvalu', code: 'TV'},
            {name: 'Uganda', code: 'UG'},
            {name: 'Ukraine', code: 'UA'},
            {name: 'United Arab Emirates', code: 'AE'},
            {name: 'United Kingdom', code: 'GB'},
            {name: 'United States', code: 'US'},
            //{name: 'United States Minor Outlying Islands', code: 'UM'},
            {name: 'Uruguay', code: 'UY'},
            {name: 'Uzbekistan', code: 'UZ'},
            {name: 'Vanuatu', code: 'VU'},
            {name: 'Venezuela', code: 'VE'},
            {name: 'Viet Nam', code: 'VN'},
            {name: 'Virgin Islands, British', code: 'VG'},
            {name: 'Virgin Islands, U.S.', code: 'VI'},
            //{name: 'Wallis and Futuna', code: 'WF'},
            {name: 'Western Sahara', code: 'EH'},
            {name: 'Yemen', code: 'YE'},
            {name: 'Zambia', code: 'ZM'},
            {name: 'Zimbabwe', code: 'ZW'}
        ];
        $scope.apply = function () {
            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                $scope.$apply();
            }
            return false;
        };

        // What to do after authentication
        $scope.runTheProcess = function () {
            User.get($scope, {});
            ga('send', 'pageview', '/admin/redgional_settings');
        };
        // We need to call this to refresh token when user credentials are invalid
        $scope.refreshToken = function () {
            Auth.refreshToken();
        };
        Auth.init($scope);
    }]);

