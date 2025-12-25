"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'np';

interface LanguageContextType {
    language: Language;
    toggleLanguage: () => void;
    t: (key: string) => string;
}

const translations = {
    en: {
        home: 'Home',
        services: 'Services',
        checkStatus: 'Check Status',
        support: 'Support',
        login: 'Login',
        register: 'Register',
        dashboard: 'Dashboard',
        logout: 'Logout',
        portalName: 'Rastriya License Portal',
        welcomeBack: 'Welcome Back',
        adminPortal: 'Admin Portal',
        restrictedAccess: 'Restricted Access. Authorized Personnel Only.',
        username: 'Username',
        password: 'Password',
        accessDashboard: 'Access Dashboard',
        totalApplications: 'Total Applications',
        pendingReview: 'Pending Review',
        approved: 'Approved',
        rejected: 'Rejected',
        refNo: 'Ref No',
        applicant: 'Applicant',
        service: 'Service',
        status: 'Status',
        actions: 'Actions',
        noApplications: 'No applications found',
        resolved: 'Resolved',
        approve: 'Approve',
        reject: 'Reject',
        viewDetails: 'View Details',
        accessDenied: 'Access Denied: Admins Only',
        loginFailed: 'Invalid Credentials',
        updateFailed: 'Update Failed',
        nidLabel: 'National ID (NID)',
        nidPlaceholder: 'Enter your NID number',
        dobLabel: 'Date of Birth (BS)',
        dobPlaceholder: 'YYYY-MM-DD',
        loginSubtitle: 'Log in with your National ID to access services',
        loginSecurely: 'Login Securely',
        noAccount: "Don't have an account?",
        registerNow: 'Register Now',
        createAccount: 'Create Account',
        registerSubtitle: 'Register your details to start using e-services',
        fullName: 'Full Name',
        fullNamePlaceholder: 'As per Citizenship',
        mobile: 'Mobile Number',
        mobilePlaceholder: '98XXXXXXXX',
        defaultPassMsg: "Default password will be set to '123456' for this demo.",
        registerAccount: 'Register Account',
        alreadyHaveAccount: 'Already have an account?',
        loginHere: 'Login Here',
        heroTitle: 'Rastriya License Portal',
        heroSubtitle: "The official digital gateway for Nepal's driving license services. Fast, secure, and completely paperless.",
        renewLicense: 'Renew License',
        ourServices: 'Our Services',
        servicesDesc: 'Comprehensive digital solutions for all your transport management needs.',
        onlineRenewal: 'Online Renewal',
        onlineRenewalDesc: 'Renew your driving license in minutes. Upload documents, pay fees, and get verified instantly.',
        newApplication: 'New Application',
        newApplicationDesc: 'Apply for a new driving license. Schedule written exams and trials at your convenience.',
        appTracking: 'Application Tracking',
        appTrackingDesc: 'Real-time status updates on your application. Know exactly where your license is.',
        // New Keys
        allServices: 'All Services',
        allServicesDesc: 'Everything you need to manage your driving and vehicle documentation, all in one place.',
        svcLicenseRenewal: 'License Renewal',
        svcNewApp: 'New Application',
        svcVehicleTax: 'Vehicle Tax',
        svcBlueBook: 'Blue Book Renewal',
        svcOwnershipTransfer: 'Ownership Transfer',
        svcExamStatus: 'Exam Status',
        svcDescRenewal: 'Securely renew your driving license online.',
        svcDescNewApp: 'Apply for a new driving license (Bike, Car, Scooter).',
        svcDescTax: 'Pay your annual vehicle tax and insurance.',
        svcDescBlueBook: 'Update your vehicle ownership document.',
        svcDescTransfer: 'Transfer vehicle ownership securely.',
        svcDescExam: 'Check your written exam or trial status.',
        trackStatusTitle: 'Track Application Status',
        trackStatusDesc: 'Enter your Reference Number or National ID to check current status.',
        enterRefPlaceholder: 'Enter Reference No. (e.g. REF-2025-XXXX)',
        trackBtn: 'Track Status',
        appFound: 'Application Found',
        appNotFound: 'Application not found',
        // Removed duplicated admin keys
    },
    np: {
        home: 'गृहपृष्ठ',
        services: 'सेवाहरू',
        checkStatus: 'स्थिति हेर्नुहोस्',
        support: 'सहयोग',
        login: 'लगइन',
        register: 'दर्ता',
        dashboard: 'ड्यासबोर्ड',
        logout: 'लगआउट',
        portalName: 'राष्ट्रिय लाइसेन्स पोर्टल',
        welcomeBack: 'स्वागत छ',
        adminPortal: 'प्रशासक पोर्टल',
        restrictedAccess: 'निषेधित क्षेत्र। केवल अधिकृत कर्मचारीहरू।',
        username: 'प्रयोगकर्ता नाम',
        password: 'पासवर्ड',
        accessDashboard: 'ड्यासबोर्ड प्रवेश',
        totalApplications: 'कुल आवेदनहरू',
        pendingReview: 'समीक्षाको लागि बाँकी',
        approved: 'स्वीकृत',
        rejected: 'अस्वीकृत',
        refNo: 'सन्दर्भ नं',
        applicant: 'आवेदक',
        service: 'सेवा',
        status: 'स्थिति',
        actions: 'कार्यहरू',
        noApplications: 'कुनै आवेदन फेला परेन',
        resolved: 'समाधान भयो',
        approve: 'स्वीकार',
        reject: 'अस्वीकार',
        viewDetails: 'विवरण हेर्नुहोस्',
        accessDenied: 'प्रवेश निषेध: केवल प्रशासकहरू',
        loginFailed: 'अमान्य प्रमाणहरू',
        updateFailed: 'अद्यावधिक असफल भयो',
        nidLabel: 'राष्ट्रिय परिचयपत्र (NID)',
        nidPlaceholder: 'तपाईंको NID नम्बर प्रविष्ट गर्नुहोस्',
        dobLabel: 'जन्म मिति (वि.सं.)',
        dobPlaceholder: '२०XX-XX-XX',
        loginSubtitle: 'सेवाहरू प्राप्त गर्न आफ्नो राष्ट्रिय परिचयपत्र (NID) मार्फत लगइन गर्नुहोस्',
        loginSecurely: 'सुरक्षित लगइन',
        noAccount: 'खाता छैन?',
        registerNow: 'अहिले दर्ता गर्नुहोस्',
        createAccount: 'खाता सिर्जना गर्नुहोस्',
        registerSubtitle: 'ई-सेवाहरू प्रयोग गर्न आफ्नो विवरण दर्ता गर्नुहोस्',
        fullName: 'पूरा नाम',
        fullNamePlaceholder: 'नागरिकता अनुसार',
        mobile: 'मोबाइल नम्बर',
        mobilePlaceholder: '९८XXXXXXXX',
        defaultPassMsg: "यस डेमोको लागि पूर्वनिर्धारित पासवर्ड '123456' सेट गरिनेछ।",
        registerAccount: 'खाता दर्ता गर्नुहोस्',
        alreadyHaveAccount: 'पहिले नै खाता छ?',
        loginHere: 'यहाँ लगइन गर्नुहोस्',
        heroTitle: 'राष्ट्रिय लाइसेन्स पोर्टल',
        heroSubtitle: 'नेपालको सवारी अनुमति पत्र सेवाहरूको लागि आधिकारिक डिजिटल गेटवे। छिटो, सुरक्षित र पूर्ण रूपमा कागजविहीन।',
        renewLicense: 'लाइसेन्स नवीकरण',
        // checkStatus: 'स्थिति हेर्नुहोस्', // Removed duplicate
        ourServices: 'हाम्रा सेवाहरू',
        servicesDesc: 'तपाईंको यातायात व्यवस्थापन आवश्यकताहरूका लागि विस्तृत डिजिटल समाधानहरू।',
        onlineRenewal: 'अनलाइन नवीकरण',
        onlineRenewalDesc: 'मिनेटमै आफ्नो लाइसेन्स नवीकरण गर्नुहोस्। कागजात अपलोड, शुल्क भुक्तानी, र तत्काल प्रमाणीकरण।',
        newApplication: 'नयाँ आवेदन',
        newApplicationDesc: 'नयाँ लाइसेन्सको लागि आवेदन दिनुहोस्। लिखित परीक्षा र ट्रायल आफ्नो सुविधा अनुसार तालिकाबद्ध गर्नुहोस्।',
        appTracking: 'आवेदन ट्र्याकिङ',
        appTrackingDesc: 'तपाईंको आवेदनको वास्तविक-समय स्थिति। थाहा पाउनुहोस् तपाईंको लाइसेन्स कहाँ छ।',
        // New Keys
        allServices: 'सबै सेवाहरू',
        allServicesDesc: 'तपाईंको सवारी र लाइसेन्स सम्बन्धी सबै कामका लागि एकै ठाउँ।',
        svcLicenseRenewal: 'लाइसेन्स नवीकरण',
        svcNewApp: 'नयाँ आवेदन',
        svcVehicleTax: 'सवारी कर',
        svcBlueBook: 'ब्लुबुक नवीकरण',
        svcOwnershipTransfer: 'नामसारी',
        svcExamStatus: 'परीक्षा नतिजा',
        svcDescRenewal: 'तपाईंको लाइसेन्स सुरक्षित रूपमा अनलाइन नवीकरण गर्नुहोस्।',
        svcDescNewApp: 'नयाँ ड्राइभिङ लाइसेन्सको लागि आवेदन दिनुहोस्।',
        svcDescTax: 'तपाईंको वार्षिक सवारी कर र बीमा भुक्तानी गर्नुहोस्।',
        svcDescBlueBook: 'तपाईंको सवारी धनी प्रमाणपुर्जा (ब्लुबुक) अद्यावधिक गर्नुहोस्।',
        svcDescTransfer: 'गाडीको स्वामित्व सुरक्षित रूपमा हस्तान्तरण गर्नुहोस्।',
        svcDescExam: 'लिखित वा ट्रायल परीक्षाको नतिजा हेर्नुहोस्।',
        trackStatusTitle: 'आवेदन स्थिति हेर्नुहोस्',
        trackStatusDesc: 'हालको अवस्था जाँच गर्न आफ्नो सन्दर्भ नम्बर वा राष्ट्रिय परिचयपत्र नम्बर प्रविष्ट गर्नुहोस्।',
        enterRefPlaceholder: 'सन्दर्भ नं प्रविष्ट गर्नुहोस् (उदाहरण REF-2025-XXXX)',
        trackBtn: 'स्थिति ट्रयाक गर्नुहोस्',
        appFound: 'आवेदन फेला पर्यो',
        appNotFound: 'आवेदन फेला परेन',
        // Removed duplicated admin keys
    }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguage] = useState<Language>('en');

    useEffect(() => {
        const savedLang = localStorage.getItem('language') as Language;
        if (savedLang) setLanguage(savedLang);
    }, []);

    const toggleLanguage = () => {
        const newLang = language === 'en' ? 'np' : 'en';
        setLanguage(newLang);
        localStorage.setItem('language', newLang);
    };

    const t = (key: string): string => {
        return translations[language][key as keyof typeof translations.en] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) throw new Error('useLanguage must be used within LanguageProvider');
    return context;
}
