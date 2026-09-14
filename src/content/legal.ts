// Full Privacy Policy and Terms of Use text, hosted on this site rather than
// linked out. Transcribed from katrinakavvalos.com; update here when the
// client revises either document.

export type LegalBlock = { kind: "p" | "li"; text: string };
export type LegalSection = { heading: string; blocks: LegalBlock[] };
export type LegalDoc = { title: string; lastUpdated: string; sections: LegalSection[] };

export const privacyPolicy: LegalDoc = {
  title: "Privacy policy",
  lastUpdated: "Last updated: 13 August 2019",
  sections: [
  {
    heading: "1. I respect your privacy",
    blocks: [
      { kind: "p", text: "a. I respect your right to privacy and am committed to safeguarding the privacy of my customers and website visitors. This policy sets out how I collect and treat your personal information." },
      { kind: "p", text: "b. I adhere to the Australian Privacy Principles contained in the Privacy Act 1988 (Cth) and to the extent applicable, the EU General Data Protection Regulation (GDPR)." },
      { kind: "p", text: "c. “Personal information” is information I hold which is identifiable as being about you. This includes information such as your name, email address, identification number, or any other type of information that can reasonably identify an individual, either directly or indirectly." },
      { kind: "p", text: "d. You may contact me in writing at info@katrinakavvalos.com for further information about this Privacy Policy." },
    ],
  },
  {
    heading: "2. What personal information is collected",
    blocks: [
      { kind: "p", text: "a. I will, from time to time, receive and store personal information you submit to my website, provided to me directly or given to me in other forms." },
      { kind: "p", text: "b. You may provide basic information such as your name, phone number, address and email address to enable me to send you information, provide updates and process your product or service order." },
      { kind: "p", text: "c. I may collect additional information at other times, including but not limited to, when you provide feedback, when you provide information about your personal or business affairs, change your content or email preference, respond to surveys and/or promotions." },
      { kind: "p", text: "d. Additionally, I may also collect any other information you provide while interacting with me." },
      { kind: "p", text: "e. I do not hold any financial information that belongs to you, however you should be aware that you may be providing financial information to a third party billing service to whom you may be directed at the time of agreeing to a service or purchasing a product on my website. Please ensure that you have thoroughly read their terms and conditions prior to the use of their services, as information provided to a third party is subject to their terms and conditions and not these." },
    ],
  },
  {
    heading: "3. How I collect your personal information",
    blocks: [
      { kind: "p", text: "a. I collect personal information from you in a variety of ways, including when you interact with me electronically or in person, when you access my website and when I engage in business activities with you. I may receive personal information from third parties. If I do, I will protect it as set out in this Privacy Policy." },
      { kind: "p", text: "b. By providing me with personal information, you consent to the supply of that information subject to the terms of this Privacy Policy." },
    ],
  },
  {
    heading: "4. How I use your personal information",
    blocks: [
      { kind: "p", text: "a. I may use personal information collected from you to provide you with information about my products or services. I may also make you aware of new and additional products, services and opportunities available to you." },
      { kind: "p", text: "b. I will use personal information only for the purposes that you consent to. This may include to:" },
      { kind: "p", text: "i. provide you with products and services during the usual course of my business activities;" },
      { kind: "p", text: "ii. administer my business activities;" },
      { kind: "p", text: "iii. manage, research and develop my products and services;" },
      { kind: "p", text: "iv. provide you with information about my products and services;" },
      { kind: "p", text: "v. communicate with you by a variety of measures including, but not limited to, by telephone, email, sms or mail; and" },
      { kind: "p", text: "vi. investigate any complaints." },
      { kind: "p", text: "c. If you withhold your personal information, it may not be possible for me to provide you with my products and services or for you to fully access my website." },
      { kind: "p", text: "d. I may disclose your personal information to comply with a legal requirement, such as a law, regulation, court order, subpoena, warrant, legal proceedings or in response to a law enforcement agency request." },
      { kind: "p", text: "e. If there is a change of control in my business or a sale or transfer of business assets, I reserve the right to transfer to the extent permissible at law my user databases, together with any personal information and non-personal information contained in those databases." },
    ],
  },
  {
    heading: "5. Disclosure of your personal information",
    blocks: [
      { kind: "p", text: "a. I may disclose your personal information to any of my employees, officers, insurers, professional advisers, agents, suppliers or subcontractors insofar as reasonably necessary for the purposes set out in this privacy policy." },
      { kind: "p", text: "b. If I do disclose your personal information to a third party, I will protect it in accordance with this privacy policy." },
    ],
  },
  {
    heading: "6. General Data Protection Regulation (GDPR) for the European Union (EU)",
    blocks: [
      { kind: "p", text: "a. I will comply with the principles of data protection set out in the GDPR for the purpose of fairness, transparency and lawful data collection and use." },
      { kind: "p", text: "b. I process your personal information as a Processor and/or to the extent that I am a Controller as defined in the GDPR." },
      { kind: "p", text: "c. I must establish a lawful basis for processing your personal information. The legal basis for which I collect your personal information depends on the data that I collect and how I use it." },
      { kind: "p", text: "d. I will only collect your personal information with your express consent for a specific purpose and any data collected will be to the extent necessary and not excessive for its purpose. I will keep your data safe and secure." },
      { kind: "p", text: "e. I will also process your personal information if it is necessary for my legitimate interests, or to fulfil a contractual or legal obligation." },
      { kind: "p", text: "f. I process your personal information if it is necessary to protect your life or in a medical situation, it is necessary to carry out a public function, a task of public interest or if the function has a clear basis in law." },
      { kind: "p", text: "g. I do not collect or process any personal information from you that is considered “Sensitive Personal Information” under the GDPR, such as personal information relating to your sexual orientation or ethnic origin unless I have obtained your explicit consent, or if it is being collected subject to and in accordance with the GDPR." },
      { kind: "p", text: "h. You must not provide me with your personal information if you are under the age of 16 without the consent of your parent or someone who has parental authority for you. I do not knowingly collect or process the personal information of children." },
    ],
  },
  {
    heading: "7. Your rights under the GDPR",
    blocks: [
      { kind: "p", text: "a. If you are an individual residing in the EU, you have certain rights as to how your personal information is obtained and used. I comply with your rights under the GDPR as to how your personal information is used and controlled if you are an individual residing in the EU;" },
      { kind: "p", text: "b. Except as otherwise provided in the GDPR, you have the following rights:" },
      { kind: "p", text: "a. to be informed how your personal information is being used;" },
      { kind: "p", text: "b. access your personal information (I will provide you with a free copy of it);" },
      { kind: "p", text: "c. to correct your personal information if it is inaccurate or incomplete;" },
      { kind: "p", text: "d. to delete your personal information (also known as “the right to be forgotten”);" },
      { kind: "p", text: "e. to restrict processing of your personal information;" },
      { kind: "p", text: "f. to retain and reuse your personal information for your own purposes;" },
      { kind: "p", text: "g. to object to your personal information being used; and" },
      { kind: "p", text: "h. to object against automated decision making and profiling." },
      { kind: "p", text: "c. Please contact me at any time to exercise your rights under the GDPR at the contact details in this Privacy Policy." },
    ],
  },
  {
    heading: "8. Security of your personal information",
    blocks: [
      { kind: "p", text: "a. I am committed to ensuring that the information you provide to me is secure. In order to prevent unauthorised access or disclosure, I have put in place suitable physical, electronic and managerial procedures to safeguard and secure information and protect it from misuse, interference, loss and unauthorised access, modification and disclosure." },
      { kind: "p", text: "b. Where I employ data processors to process personal information on my behalf, I only do so on the basis that such data processors comply with the requirements under the GDPR and that have adequate technical measures in place to protect personal information against unauthorised use, loss and theft." },
      { kind: "p", text: "c. The transmission and exchange of information is carried out at your own risk. I cannot guarantee the security of any information that you transmit to me, or receive from me. Although I take measures to safeguard against unauthorised disclosures of information, I cannot assure you that personal information that I collect will not be disclosed in a manner that is inconsistent with this Privacy Policy." },
    ],
  },
  {
    heading: "9. Access to your personal information",
    blocks: [
      { kind: "p", text: "a. You may request details of personal information that I hold about you in accordance with the provisions of the Privacy Act 1988 (Cth), and to the extent applicable the EU GDPR. If you would like a copy of the information which I hold about you or believe that any information I hold on you is inaccurate, out of date, incomplete, irrelevant or misleading, please email me at info@katrinakavvalos.com" },
      { kind: "p", text: "b. I reserve the right to refuse to provide you with information that I hold about you, in certain circumstances set out in the Privacy Act or any other applicable law." },
    ],
  },
  {
    heading: "10. Complaints about privacy",
    blocks: [
      { kind: "p", text: "a. If you have any complaints about my privacy practices, please feel free to send in details of your complaints to info@katrinakavvalos.com. I take complaints very seriously and will respond shortly after receiving written notice of your complaint." },
    ],
  },
  {
    heading: "11. Changes to Privacy Policy",
    blocks: [
      { kind: "p", text: "a. Please be aware that I may change this Privacy Policy in the future. I may modify this Policy at any time, in my sole discretion and all modifications will be effective immediately upon me posting of the modifications on my website or notice board. Please check back from time to time to review my Privacy Policy." },
    ],
  },
  {
    heading: "12. Website",
    blocks: [
      { kind: "p", text: "a. When you visit my website" },
      { kind: "p", text: "When you come to my website (www.katrinakavvalos.com), I may collect certain information such as browser type, operating system, website visited immediately before coming to my site, etc. This information is used in an aggregated manner to analyse how people use my site, such that I can improve my service." },
      { kind: "p", text: "b. Third party sites" },
      { kind: "p", text: "My site may from time to time have links to other websites not owned or controlled by me. These links are meant for your convenience only. Links to third party websites do not constitute sponsorship or endorsement or approval of these websites. Please be aware that I am not responsible for the privacy practises of other such websites. I encourage my users to be aware, when they leave my website, to read the privacy statements of each and every website that collects personal identifiable information." },
    ],
  },
  {
    heading: "13. Use of Cookies",
    blocks: [
      { kind: "p", text: "a. What is a Cookie?" },
      { kind: "p", text: "A cookie is a small piece of data that a website asks your browser to store on your computer or mobile device. The cookie allows the website to “remember” your actions or preferences over time. Most Internet browsers support cookies; however, users can set their browsers to decline certain types of cookies or specific cookies. Further, users can delete cookies at any time." },
      { kind: "p", text: "b. Why do I use cookies?" },
      { kind: "p", text: "I use cookies to learn how you interact with my content and to improve your experience when visiting my website(s). For example, some cookies remember your language or preferences so that you do not have to repeatedly make these choices when you visit one of my websites. I also use cookies to help me with geolocation tracking in order to present you with the more relevant information. Additionally, cookies allow me to serve you specific content, such as videos on our website(s). I may employ the learnings of your behaviour on my website(s) to serve you with targeted advertisements on third-party website(s) in an effort to “re-market” my products and services to you." },
      { kind: "p", text: "c. What types of cookies do we use?" },
      { kind: "p", text: "(i) First-Party and Third-Party Cookies – I use both first-party and third-party cookies on my website. First-party cookies are cookies issued from my domain that are generally used to identify language and location preferences or render basic site functionality. Third-party cookies belong to and are managed by other parties, such my service providers. These cookies may be required to render certain forms within my website." },
      { kind: "p", text: "(ii) Session Cookies – Session cookies are temporary cookies that are used to remember you during the course of your visit to the website, and they expire when you close the web browser." },
      { kind: "p", text: "(iii) Persistent Cookies – Persistent cookies are used to remember your preferences within the website and remain on your desktop or mobile device even after you close your browser or restart your computer. I use these cookies to analyse user behavior to establish visit patterns so that I can improve my website functionality for you and others who visit our website(s). These cookies also allow me to serve you with targeted advertising and measure the effectiveness of my site functionality and advertising." },
      { kind: "p", text: "d. How are cookies used for advertising purposes?" },
      { kind: "p", text: "Cookies and ad technology such as web beacons, pixels, and anonymous ad network tags help me serve relevant ads to you more effectively. They also help me collect aggregated audit data, research, and performance reporting for advertisers. Pixels enable me to understand and improve the delivery of ads to you, and know when certain ads have been shown to you. Since your web browser may request advertisements and web beacons directly from ad network servers, these networks can view, edit, or set their own cookies, just as if you had requested a web page from their site. Although I do not use cookies to create a profile of your browsing behavior on third-party sites, I do use aggregate data from third parties to show you relevant, interest-based advertising. I do not provide any personal information that I collect to advertisers. You can opt out of off-site and third-party-informed advertising by adjusting your cookie settings. Opting out will not remove advertising from the pages you visit, but, instead, opting out will result in the ads you see not being matched to your interests. This implies that the ad(s) you see will not be matched to your interests by those specific cookies." },
      { kind: "p", text: "e. How are third party cookies used?" },
      { kind: "p", text: "For some of the functions within my websites I use third party suppliers, for example, when you visit a page with videos embedded from or links to YouTube. These videos or links (and any other content from third party suppliers) may contain third party cookies, and I encourage you to consult the privacy policies of these third party vendors on their websites for information regarding their use of cookies." },
      { kind: "p", text: "f. How do I reject and delete cookies?" },
      { kind: "p", text: "You can choose to reject or block all or specific types of cookies set by virtue of your visit to my website by clicking on the cookie preferences on my website(s). You can change your preferences for my websites and/or the websites of any third party suppliers by changing your browser settings. Please note that most browsers automatically accept cookies. Therefore, if you do not wish cookies to be used, you may need to actively delete or block the cookies. If you reject the use of cookies, you will still be able to visit my websites but some of the functions may not work correctly. By using my website without deleting or rejecting some or all cookies, you agree that we can place those cookies that you have not deleted or rejected on your device." },
    ],
  },
  ],
};

export const termsOfUse: LegalDoc = {
  title: "Terms of Use",
  lastUpdated: "These terms were last revised on 28 August 2019",
  sections: [
  {
    heading: "1. Purpose",
    blocks: [
      { kind: "p", text: "1.1 This agreement (‘Agreement’) outlines the terms and between you and Katrina Kavvalos, a business which owns the website of www.katrinakavvalos.com (referred to as the “Site”)." },
      { kind: "p", text: "1.2 Please read the agreement carefully before using the Site. By using the Website, you signify your agreement to these terms of use. If you do not agree to these terms, you may not use the Website. In addition, when you use any of our current or future services, you will also be subject to our guidelines, terms, conditions and agreements applicable to those services. If the agreement is inconsistent with the guidelines, terms and agreements applicable to those services, this agreement applies." },
      { kind: "p", text: "1.3 If you do not agree to be bound by this agreement, do not use the Site or the Services." },
      { kind: "p", text: "1.4 Your use of, or participation in, certain Services may be subject to additional terms, and such terms will either be listed in this Agreement or will be presented to you for acceptance when you sign up to use such Services." },
      { kind: "p", text: "1.5 In consideration for providing you with a license to use the Site, you agree only to use the Site in accordance with these terms." },
    ],
  },
  {
    heading: "2. Parties",
    blocks: [
      { kind: "p", text: "2.1 The parties to these terms are:" },
      { kind: "p", text: "(a) Katrina Kavvalos International Trust, ABN 34 705 335 487 (“me”, “I” and “my”); and" },
      { kind: "p", text: "(b) an end user (including anyone who views the site), anyone who uses our site (“you”)." },
    ],
  },
  {
    heading: "3. Products and Services",
    blocks: [
      { kind: "p", text: "3.1 My site offers the following Services:" },
      { kind: "li", text: "Consultancy;" },
      { kind: "li", text: "Seminars;" },
      { kind: "li", text: "Blogs;" },
      { kind: "li", text: "Articles" },
      { kind: "p", text: "3.2 My site may offer the following Products:" },
      { kind: "li", text: "Not applicable at this stage." },
      { kind: "p", text: "3.3 I may offer additional services or revise any of the Services or Products, at my discretion, and with or without notice. This Agreement will apply to all additional services or revised Services. I also reserve the right to cease offering any of the Services at any time without prior notice." },
      { kind: "p", text: "3.4 To avoid doubt, the Services do not include any commercial or business purpose or activity by anyone other than me, unless provided permission under further terms of business." },
    ],
  },
  {
    heading: "4. Variation of Agreement",
    blocks: [
      { kind: "p", text: "This agreement is subject to change by us in its sole discretion at any time, with or without notice. Your continued use of this Site or the Services after the posting of changes to this Agreement constitutes your acceptance of such changes. Please consult the end of this Agreement to determine when the Agreement was last revised." },
    ],
  },
  {
    heading: "5. Limited License to Use Site",
    blocks: [
      { kind: "p", text: "5.1 The Content contained on the Site (collectively, “Content“), such as text, graphics, logos, icons, images, audio and video clips, digital downloads, data compilations, and software, is our property or the property of our licensors or licensees, and the compilation of the Content on the Site is our exclusive property, protected by Australian and international copyright laws, treaties and conventions. All software used on the Site is our property or the property of our software suppliers and protected by Australian and international copyright laws, treaties and conventions." },
      { kind: "p", text: "5.2 We grant you a limited license to access and make personal use of the Site. No Content of the Site or any other Internet site owned, operated, licensed, or controlled by us may be copied, reproduced, republished, downloaded (other than page caching), uploaded, posted, transmitted or distributed in any way, or sold, resold, visited, or otherwise exploited for any commercial purpose, except that you may download one (1) copy of the Content that we make available to you for such purposes on a single computer for your personal, noncommercial, home use only, provided that you: (a) keep intact all copyright, trademark and other proprietary rights notices; (b) do not modify any of the Content; (c) do not use any Content in a manner that suggests an association with any of our products, services or brands; and (d) do not download Content so as to avoid future downloads from the Site. Your use of Content on any other website or computer environment is strictly prohibited." },
      { kind: "p", text: "5.3 This License granted to you does not include, and specifically excludes, any rights to: resell or make any commercial use of the Site or any Content; collect and use any product listings, descriptions, or prices; make any derivative use of the Site or Content; download or copy account information for the benefit of anyone else; or use any form of data mining, robots, or similar data gathering and extraction tools. You may not frame, or utilize framing techniques to enclose, any Mark, Content or other proprietary information, or use any meta tags or any other “hidden text” utilizing any such intellectual property, without our and each applicable owner’s express written consent. Any unauthorized use automatically terminates the license granted to you hereunder. You are granted a limited, revocable, and non-exclusive right to create a hyperlink only to our home page provided that the link does not portray us or our licensors or licensees, or their respective products or services, in a false, misleading, derogatory, or otherwise offensive matter. You may not use any of our or any such party’s intellectual property as part of the link without our and each such party’s express written consent." },
      { kind: "p", text: "5.4 Your license is made up of the following:" },
      { kind: "p", text: "5.4.1 this document;" },
      { kind: "p", text: "5.4.2 our privacy policy; and" },
      { kind: "p", text: "5.4.3 any other policy that we may publish on the Site from time to time." },
      { kind: "p", text: "5.5 A condition of this licence is that:" },
      { kind: "p", text: "5.5.1 except for the free membership category, and only where relevant, you must pay the appropriate membership fee to access the benefits and features of different membership levels;" },
      { kind: "p", text: "5.5.2 we may contact you by email for the purposes outlined in our privacy policy;" },
      { kind: "p", text: "5.5.3 our advertisers, and other users of the site may send you email from the site;" },
      { kind: "p", text: "5.5.4 you may only establish and use one user account with the site;" },
      { kind: "p", text: "5.5.5 your use of the site signifies your agreement to these terms (as amended from time to time); and" },
      { kind: "p", text: "5.5.6 you may not share your account with anyone else." },
      { kind: "p", text: "5.5.7 You must ensure that:" },
      { kind: "p", text: "5.5.7.1 all information you provide us in registering to use the site is true and correct, and is at all times kept up to date; and" },
      { kind: "p", text: "5.5.7.2 you comply with all applicable laws." },
    ],
  },
  {
    heading: "6. Use of Site and Services",
    blocks: [
      { kind: "p", text: "(a) Exclusive Use: Your account is for your personal use only. You may not authorise others to use your account, and you may not assign or otherwise transfer your license to use your account to any other person or entity. You acknowledge that we are not responsible for any loss incurred by you which arise as a result of third party access to your account that results from the sharing by you or the theft or misappropriation of your user name or passwords." },
      { kind: "p", text: "(b) Geographical Limitations: You will only use the Services in a manner consistent with this agreement, and any and all applicable local, state, territorial, national and international laws and regulations." },
      { kind: "p", text: "(c) Information Submitted: You are solely responsible for, and assume all liability regarding, (i) the information and content you contribute to the Site and Service (ii) the information and content you post, transmit, publish or otherwise make available through the Services, and (iii) your interactions with other users through the Services." },
      { kind: "p", text: "(d) Risk Assumption and Precautions. You assume all risk when using the Services, including but not limited to all of the risks associated with any online or offline interactions with others. You acknowledge that we are unable to guarantee the accuracy of information provided to you by or about other users. You agree to take all necessary precautions when communicating with users of this Service. You understand that we make no representations, warranties or guarantees, either express or implied, regarding the information contained on this Site by other users." },
      { kind: "p", text: "(e) Content Removal. We reserve the right, but have no obligation, to monitor the information or material you submit to the Services or post in the public areas of the Services. We will have the right to remove any such information or material that in our sole opinion violates, or may violate, any applicable law, or the letter or spirit of this Agreement, or upon the reasonable request of any third party. Notwithstanding this right, you remain solely responsible for the content of the materials you post." },
      { kind: "p", text: "(f) Posting and Communication Restrictions. In addition to the terms of this Agreement, you agree to abide by codes of conduct which may be incorporated by reference into this Agreement, when posting content on the Services. You must not post onto the Site or the Services, transmit to other users, communicate any content (or links thereto), or otherwise engage in or encourage any activity when using the Site or the Services that:" },
      { kind: "li", text: "breaches any other contractual obligations you may have with another party, including any employment agreements or covenants;" },
      { kind: "li", text: "promotes racism, bigotry, hatred or physical harm of any kind against any group or individual;" },
      { kind: "li", text: "is intended to or has the effect of harassing, threatening or intimidating any other users of the Site or Services;" },
      { kind: "li", text: "is defamatory, inaccurate, abusive, obscene, profane, offensive, fraudulent or otherwise objectionable;" },
      { kind: "li", text: "contains content or links to content (including but not limited to music, movies, videos, photographs, images, software, etc.) that infringes or violates another party’s rights (including, but not limited to, intellectual property rights and rights of privacy and publicity);" },
      { kind: "li", text: "contains video, audio photographs, or images of another person without his or her permission (or in the case of a minor, the minor’s legal guardian);" },
      { kind: "li", text: "promotes or encourages illegal or unlawful activities, such as instructions on how to make or buy illegal weapons or drugs, create or disseminate computer viruses, or circumvent copy-protect devices;" },
      { kind: "li", text: "is intended to or has the potential to defraud, swindle or deceive other users of the Services;" },
      { kind: "li", text: "contains viruses, time bombs, trojan horses, cancelbots, worms, restricted or hidden password protected pages or other harmful, or disruptive codes, components or devices;" },
      { kind: "li", text: "promotes or solicits involvement in or support of a political platform, religion, cult, or sect;" },
      { kind: "li", text: "is intended to interfere with other users or potential user’s enjoyment of the Site or Services;" },
      { kind: "li", text: "impersonates, or otherwise misrepresents an affiliation, connection or association with, any person or entity;" },
      { kind: "li", text: "solicits gambling or engages in any type of gambling, gaming or similar activity;" },
      { kind: "li", text: "uses scripts, bots or other automated technology to access the Site or Services;" },
      { kind: "li", text: "uses the Site or Services for chain letter, junk mail or ‘spam’ e-mails in contravention of the Spam Act 2003 (Cth);" },
      { kind: "li", text: "collects or solicits personal information from anyone under age 18 or is otherwise predatory; or" },
      { kind: "li", text: "is in any way used for or in connection with spamming, spimming, phishing, trolling, or similar unlawful activities." },
      { kind: "p", text: "(g) No Advertising or Commercial Solicitation. You must not advertise or solicit any user to buy or sell any products or services through the Site or Services. You must not transmit any chain letters, junk or spam e-mail to other users. Further, you will not use any information obtained from the Services in order to contact, advertise to, solicit, or sell to any user without their prior explicit consent. If you breach the terms of this clause and send or post unsolicited bulk email, “spam” or other unsolicited communications of any kind through the Services, you acknowledge that you will have caused substantial harm to us." },
    ],
  },
  {
    heading: "7. External links and Activities",
    blocks: [
      { kind: "p", text: "7.1 We may provide you with links to external websites from the site (“External Links”), where we do you acknowledge that:" },
      { kind: "li", text: "we do not endorse or recommend such website;" },
      { kind: "li", text: "websites do not form part of our website;" },
      { kind: "li", text: "we do not warrant that (i) any information contained in such website is true and correct;(ii) these external websites do not contain viruses, trojans and other malware." },
      { kind: "p", text: "7.2 We may promote, advertise or sponsor functions, events, travel packages, offers, products, services, competitions or other activities that may be conducted offline and may be conducted by other parties (“External Activities”)." },
      { kind: "p", text: "7.3 We may also provide you with External Links for the purpose of External Activities, where we do you acknowledge that:" },
      { kind: "li", text: "we do not endorse or recommend such External Activities or External Links;" },
      { kind: "li", text: "such External Activities or External Links do not form part of our website and may be subject to separate terms and conditions;" },
      { kind: "li", text: "you participate in any External Activities or use External Links at your own risk;" },
      { kind: "li", text: "we are not liable for any loss, damage or claim arising from External Activities or External Links whether or not such External Activities or External Links are provided by our agents or contractors;" },
      { kind: "p", text: "7.4 We do not warrant that: (i) any information contained in such website activities or links is true and correct; (ii) these external do not contain viruses, Trojans and other malware." },
    ],
  },
  {
    heading: "8. Intellectual Property",
    blocks: [
      { kind: "li", text: "8.1 Ownership of Content. You acknowledge and agree that we own and retain all intellectual and other proprietary rights in the Site, the Services and any Products sold directly on this Website (unless expressly stated otherwise)." },
      { kind: "li", text: "8.2 No Use of Content. You must not post, copy, modify, communicate, transmit, publish, perform, display, disclose, show in public, create any derivative works from, distribute, make commercial use of, or reproduce in any way any (i) the Content or (ii) other copyrighted material, trade-marks and other proprietary content accessible via the Site and the Services, without first obtaining the prior written consent of the owner of the proprietary rights." },
      { kind: "li", text: "8.3 Other Users’ Information. Other users may post copyrighted Content, which has copyright protection whether or not it is identified as copyrighted. Except for that content for which you have been given permission, you agree that you will not copy, modify, communicate, transmit, publish, perform, display, disclose, show in public, create any derivative works from, distribute, make commercial use of, or reproduce in any way any of our, or third party, copyrighted content which is made available via the Services or the Site." },
      { kind: "li", text: "8.4 Grant of Licence. By posting information or content to any profile pages or public area of the Services, you automatically grant, and you represent and warrant that you have the right to grant, to us and our users, an irrevocable, perpetual, non-exclusive, fully-paid (and royalty free), worldwide licence to use, reproduce, communicate, publicly perform, publicly display and distribute such information and content, and to prepare derivative works of, or incorporate into other works, such information and content, and to grant and authorize sub-licenses of the foregoing. You further waive any moral rights you may have in any such information or content. From time to time, we may create, test or implement new features or programs on the Site (e.g, rating of user photos or profiles by other users) in which you may voluntarily choose to participate, in accordance with the additional terms and conditions of such features or programs. By your voluntary participation in such features or programs, you grant us the rights stated in this clause in connection with the additional terms and conditions (if any) of such features." },
      { kind: "li", text: "8.5 Notice of Infringement. You must notify us immediately if you become aware of any advertisement or user profile on the sites which infringes the intellectual property rights of any third party." },
    ],
  },
  {
    heading: "9. Limitation of liability and indemnity",
    blocks: [
      { kind: "p", text: "9.1 Limitation and Liquidated Damages. To the extent permitted by law, in no event shall we be liable for any incidental, special, consequential or indirect damages arising out of or relating to the use or inability to use the site or services, including, without limitation, damages for loss or corruption of data or programs, service interruptions and procurement of substitute services, even if we know or has been advised of the possibility of such damages. Under no circumstances will our aggregate liability, in any form of action whatsoever in connection with this agreement or the use of the services or the site, exceed $100.00. We shall not be responsible or liable for any damages or losses resulting from any correspondence or business dealings with third party advertisers or resulting from the presence of such advertisers on the Site or Services." },
    ],
  },
  {
    heading: "10. Disclaimer",
    blocks: [
      { kind: "p", text: "10.1No warranties. This section will apply to the maximum extent permitted by applicable law. We provide the Site, Services and Products on an “as is” and “as available” basis and disclaim all representations, warranties and conditions of any kind, whether express, implied, statutory or otherwise with respect to the Services or the Site (including all information contained therein), and including any implied warranties of merchantability, fitness for a particular purpose, non-infringement, title or ownership. To the extent we are not permitted to exclude any implied warranties, our liability is limited (at our option) to (a) where the breach relates to goods, the repair or replacement of the goods, the supply of equivalent goods or the payment of the cost of repairing or replacing the goods or supplying equivalent goods; or (b) where the breach relates to the supply of a service, resupplying the service or payment of the cost of having the service resupplied. To the extent permitted by law, we do not warrant that your use of the site or services will be secure, uninterrupted, always available, error-free or will meet your requirements, or that any defects in the site or services will be corrected. We disclaim liability for, and no representation or warranty is made with respect to the connectivity and availability of the services. The provisions of the United Nations Convention on Contracts for the International Sale of Goods is hereby disclaimed." },
      { kind: "p", text: "10.2Third party content. Opinions, advice, statements, offers, or other information or content made available through the Services, but not directly by us, are those of their respective authors (who may be other users) and should not necessarily be relied upon. Such authors are solely responsible for such content. We do not guarantee the accuracy, completeness or suitability of any information provided on the Site or Services, nor adopt, endorse or accept responsibility for the accuracy or reliability of any opinion, advice, or statement made by any party other than us. Under no circumstances will we be responsible for any claim, loss or damage resulting, directly or indirectly, from any person’s reliance on information or other content posted on the Site or Services, or transmitted to or by any users." },
    ],
  },
  {
    heading: "11. Termination / Suspension",
    blocks: [
      { kind: "p", text: "11.1. In addition to any other right we have under these terms, we may terminate or suspend your licence to use the site at anytime:" },
      { kind: "li", text: "if applicable, where you fail to pay us money, where you make a payment through an unauthorised or unlawful payment method or chargeback money you have paid us; or" },
      { kind: "li", text: "where you breach these terms or any other policy; or" },
      { kind: "li", text: "for any other reason we deem appropriate;" },
      { kind: "p", text: "11.2. If applicable, where your membership is terminated by us, you will not be entitled to a refund of any fees paid or pro rata thereof. This clause shall not merge upon termination of this agreement." },
      { kind: "p", text: "11.3. In addition to any other right of termination we may terminate your licence to use our site at any time where we wish to discontinue our site or redevelop our site" },
      { kind: "p", text: "11.4. You may terminate your account with us at any time, but where you do and if applicable, any membership fees you have paid are forfeited, to the extent permitted by law." },
    ],
  },
  {
    heading: "12. Service",
    blocks: [
      { kind: "p", text: "12.1 Either party may give notice:" },
      { kind: "li", text: "by email through the Contact Us page on our site;" },
      { kind: "li", text: "by ordinary mail or hand delivery, in our case to the current postal address indicated by our web site contact details page – and in no other way." },
      { kind: "li", text: "A notice is deemed to be served:" },
      { kind: "li", text: "if it is mailed: before noon on the second business day after posting;" },
      { kind: "li", text: "if it is emailed during business hours upon the email leaving the sender’s mail server, and if outside business hours 9am on the next business day;" },
      { kind: "li", text: "Until we otherwise advise you in writing our address for service by mail is:" },
      { kind: "p", text: "PO BOX 888," },
      { kind: "p", text: "KINGSGROVE NSW 2208" },
      { kind: "p", text: "SYDNEY AUSTRALIA" },
    ],
  },
  {
    heading: "13. No Agency",
    blocks: [
      { kind: "p", text: "Nothing in this Agreement shall be deemed to constitute, create, imply, give effect to, or otherwise recognise a partnership, joint venture, or formal business entity of any kind, and the rights and obligations of the parties shall be limited to those expressly set forth herein." },
    ],
  },
  {
    heading: "14. Severance",
    blocks: [
      { kind: "p", text: "If any provision in this agreement is unlawful or inconsistent with any law, then to the extent of the unlawful nature or inconsistency, that provision may be severed from without affecting the remainder of the agreement." },
    ],
  },
  {
    heading: "15. Jurisdiction",
    blocks: [
      { kind: "p", text: "15.1Subject to clause 15.2, this agreement and any contract arising under it is governed exclusively by the laws of New South Wales, Australia. Any legal proceedings relating to them can only be taken in courts with jurisdiction in New South Wales." },
      { kind: "p", text: "15.2Where the law gives you a right to bring a proceeding in any other state of Australia, then clause 15.1 does not in any way limit that right." },
    ],
  },
  {
    heading: "16. Waiver",
    blocks: [
      { kind: "p", text: "No right under these terms can be waived except by notice in writing signed by the party waiving it. If a party overlooks a breach by the other party on one or more occasions, it is not taken to have agreed to any future breach." },
    ],
  },
  {
    heading: "17. General",
    blocks: [
      { kind: "p", text: "Headings and footnotes are only for convenience. They are to be ignored when interpreting the Agreement." },
      { kind: "p", text: "a. A reference to the singular includes the plural and vice versa." },
      { kind: "p", text: "b. Where one thing is said to include one or more other things, it is not limited to those other things." },
      { kind: "p", text: "c. There is no significance in the use of gender-specific language." },
      { kind: "p", text: "d. A “person” includes any entity which can sue and be sued." },
      { kind: "p", text: "e. A “person” includes any legal successor to or representative of that person." },
      { kind: "p", text: "f. A reference to a law includes any amendment or replacement of that law." },
    ],
  },
  ],
};
