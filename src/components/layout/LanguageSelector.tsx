import { useEffect, useState } from "react";
import { Globe, ChevronDown, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";

interface Language {
  code: string;
  name: string;
  nativeName: string;
}

const languages: Language[] = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "es", name: "Spanish", nativeName: "Español" },
  { code: "fr", name: "French", nativeName: "Français" },
  { code: "de", name: "German", nativeName: "Deutsch" },
  { code: "it", name: "Italian", nativeName: "Italiano" },
  { code: "pt", name: "Portuguese", nativeName: "Português" },
  { code: "ru", name: "Russian", nativeName: "Русский" },
  { code: "zh-CN", name: "Chinese (Simplified)", nativeName: "简体中文" },
  { code: "zh-TW", name: "Chinese (Traditional)", nativeName: "繁體中文" },
  { code: "ja", name: "Japanese", nativeName: "日本語" },
  { code: "ko", name: "Korean", nativeName: "한국어" },
  { code: "ar", name: "Arabic", nativeName: "العربية" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা" },
  { code: "pa", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்" },
  { code: "te", name: "Telugu", nativeName: "తెలుగు" },
  { code: "mr", name: "Marathi", nativeName: "मराठी" },
  { code: "gu", name: "Gujarati", nativeName: "ગુજરાતી" },
  { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ" },
  { code: "ml", name: "Malayalam", nativeName: "മലയാളം" },
  { code: "th", name: "Thai", nativeName: "ไทย" },
  { code: "vi", name: "Vietnamese", nativeName: "Tiếng Việt" },
  { code: "id", name: "Indonesian", nativeName: "Bahasa Indonesia" },
  { code: "ms", name: "Malay", nativeName: "Bahasa Melayu" },
  { code: "tl", name: "Filipino", nativeName: "Filipino" },
  { code: "nl", name: "Dutch", nativeName: "Nederlands" },
  { code: "pl", name: "Polish", nativeName: "Polski" },
  { code: "uk", name: "Ukrainian", nativeName: "Українська" },
  { code: "cs", name: "Czech", nativeName: "Čeština" },
  { code: "sk", name: "Slovak", nativeName: "Slovenčina" },
  { code: "hu", name: "Hungarian", nativeName: "Magyar" },
  { code: "ro", name: "Romanian", nativeName: "Română" },
  { code: "bg", name: "Bulgarian", nativeName: "Български" },
  { code: "hr", name: "Croatian", nativeName: "Hrvatski" },
  { code: "sr", name: "Serbian", nativeName: "Српски" },
  { code: "sl", name: "Slovenian", nativeName: "Slovenščina" },
  { code: "el", name: "Greek", nativeName: "Ελληνικά" },
  { code: "tr", name: "Turkish", nativeName: "Türkçe" },
  { code: "he", name: "Hebrew", nativeName: "עברית" },
  { code: "fa", name: "Persian", nativeName: "فارسی" },
  { code: "ur", name: "Urdu", nativeName: "اردو" },
  { code: "sw", name: "Swahili", nativeName: "Kiswahili" },
  { code: "af", name: "Afrikaans", nativeName: "Afrikaans" },
  { code: "zu", name: "Zulu", nativeName: "isiZulu" },
  { code: "am", name: "Amharic", nativeName: "አማርኛ" },
  { code: "ne", name: "Nepali", nativeName: "नेपाली" },
  { code: "si", name: "Sinhala", nativeName: "සිංහල" },
  { code: "my", name: "Myanmar", nativeName: "မြန်မာ" },
  { code: "km", name: "Khmer", nativeName: "ខ្មែរ" },
  { code: "lo", name: "Lao", nativeName: "ລາວ" },
  { code: "ka", name: "Georgian", nativeName: "ქართული" },
  { code: "hy", name: "Armenian", nativeName: "Հայերdelays" },
  { code: "az", name: "Azerbaijani", nativeName: "Azərbaycan" },
  { code: "uz", name: "Uzbek", nativeName: "Oʻzbek" },
  { code: "kk", name: "Kazakh", nativeName: "Қазақ" },
  { code: "mn", name: "Mongolian", nativeName: "Монгол" },
  { code: "et", name: "Estonian", nativeName: "Eesti" },
  { code: "lv", name: "Latvian", nativeName: "Latviešu" },
  { code: "lt", name: "Lithuanian", nativeName: "Lietuvių" },
  { code: "fi", name: "Finnish", nativeName: "Suomi" },
  { code: "sv", name: "Swedish", nativeName: "Svenska" },
  { code: "no", name: "Norwegian", nativeName: "Norsk" },
  { code: "da", name: "Danish", nativeName: "Dansk" },
  { code: "is", name: "Icelandic", nativeName: "Íslenska" },
  { code: "ga", name: "Irish", nativeName: "Gaeilge" },
  { code: "cy", name: "Welsh", nativeName: "Cymraeg" },
  { code: "eu", name: "Basque", nativeName: "Euskara" },
  { code: "ca", name: "Catalan", nativeName: "Català" },
  { code: "gl", name: "Galician", nativeName: "Galego" },
];

declare global {
  interface Window {
    google: any;
    googleTranslateElementInit: () => void;
  }
}

export default function LanguageSelector() {
  const [currentLang, setCurrentLang] = useState<Language>(languages[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isTranslateLoaded, setIsTranslateLoaded] = useState(false);

  useEffect(() => {
    // Check if script is already loaded
    if (document.getElementById("google-translate-script")) {
      setIsTranslateLoaded(true);
      return;
    }

    // Define the callback function
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          autoDisplay: false,
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
        },
        "google_translate_element_hidden"
      );
      setIsTranslateLoaded(true);
    };

    // Load Google Translate script
    const script = document.createElement("script");
    script.id = "google-translate-script";
    script.src =
      "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup is tricky with Google Translate, so we leave it loaded
    };
  }, []);

  const translatePage = (langCode: string) => {
    const lang = languages.find((l) => l.code === langCode);
    if (lang) setCurrentLang(lang);

    // Use Google Translate
    const select = document.querySelector(
      ".goog-te-combo"
    ) as HTMLSelectElement | null;
    if (select) {
      select.value = langCode;
      select.dispatchEvent(new Event("change"));
    } else {
      // Fallback: set cookie directly
      document.cookie = `googtrans=/en/${langCode}; path=/`;
      document.cookie = `googtrans=/en/${langCode}; path=/; domain=${window.location.hostname}`;
      window.location.reload();
    }
  };

  const filteredLanguages = languages.filter(
    (lang) =>
      lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lang.nativeName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Hidden Google Translate Element */}
      <div
        id="google_translate_element_hidden"
        className="hidden"
        style={{ display: "none" }}
      />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="gap-2">
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline text-xs">{currentLang.code.toUpperCase()}</span>
            <ChevronDown className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64 bg-popover">
          <DropdownMenuLabel className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Select Language
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <div className="p-2">
            <Input
              placeholder="Search languages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 text-sm"
            />
          </div>
          <ScrollArea className="h-[300px]">
            {filteredLanguages.map((lang) => (
              <DropdownMenuItem
                key={lang.code}
                onClick={() => translatePage(lang.code)}
                className="flex items-center justify-between cursor-pointer"
              >
                <div className="flex flex-col">
                  <span className="text-sm">{lang.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {lang.nativeName}
                  </span>
                </div>
                {currentLang.code === lang.code && (
                  <Check className="h-4 w-4 text-primary" />
                )}
              </DropdownMenuItem>
            ))}
          </ScrollArea>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
