(function(){
const SURVEY_KEY='ARD_SURVEY_DRAFT';
const SUBMIT_KEY='ARD_SURVEY_SUBMISSIONS';
const surveyData={
  "title": "แบบสอบถามและแบบทดสอบหลังเรียน",
  "source": "แบบสอบถามความเชื่อมั่น 8-8-2026.docx",
  "scale": [
    {
      "value": 5,
      "label": "มากที่สุด"
    },
    {
      "value": 4,
      "label": "มาก"
    },
    {
      "value": 3,
      "label": "ปานกลาง"
    },
    {
      "value": 2,
      "label": "น้อย"
    },
    {
      "value": 1,
      "label": "น้อยที่สุด"
    }
  ],
  "confidenceItems": [
    "ฉันมั่นใจว่าสามารถจำแนกกลุ่มยาและชนิดของยาปฏิชีวนะได้",
    "ฉันมั่นใจว่าสามารถจดจำและระบุชื่อสามัญของยาปฏิชีวนะที่ใช้บ่อยได้",
    "ฉันมั่นใจว่าสามารถจดจำและระบุกลไกการออกฤทธิ์ของกลุ่มยาปฏิชีวนะได้",
    "ฉันมั่นใจว่าสามารถจดจำและบอกการนำไปใช้ทางคลินิก และประโยชน์ของยาปฏิชีวนะแต่ละชนิดได้",
    "ฉันมั่นใจว่าสามารถจดจำและระบุอาการไม่พึงประสงค์ที่สำคัญของยาปฏิชีวนะได้",
    "ฉันมั่นใจว่าสามารถจดจำข้อควรระวังในการใช้ยาปฏิชีวนะแต่ละกลุ่มได้",
    "ฉันมั่นใจว่าสามารถจดจำการพยาบาลที่สำคัญในการบริหารยาปฏิชีวนะแต่ละกลุ่ม",
    "ฉันมั่นใจว่าสามารถเชื่อมโยงกลไกการออกฤทธิ์ของยาปฏิชีวนะและการนำไปใช้ในการรักษาอาการของผู้ป่วยได้",
    "ฉันมั่นใจว่าจะเรียงลำดับการบริหารยาตามหลัก 14 R ได้ถูกต้อง",
    "ฉันมั่นใจว่าหากอาจารย์สอบถามเกี่ยวกับยาปฏิชีวนะในชั้นเรียน ฉันจะตอบอาจารย์ได้ถูกต้อง",
    "ฉันมั่นใจว่าจะสามารถวิเคราะห์สถานการณ์กรณีศึกษาเกี่ยวกับการใช้ยาปฏิชีวนะได้ถูกต้อง",
    "ฉันมั่นใจว่าฉันสามารถทำการคำนวนเกี่ยวกับขนาดการใช้ยาปฏิชีวนะได้ถูกต้อง และแม่นยำ",
    "ระหว่างการฝึกปฏิบัติงานบนหอผู้ป่วยหากอาจารย์สอบถามความรู้เกี่ยวกับกลไกการออกฤทธิ์ของกลุ่มยาปฏิชีวนะฉันมั่นใจว่าจะตอบอาจารย์ได้ถูกต้อง",
    "เมื่อฝึกปฏิบัติการดูแลผู้ป่วยหากอาจารย์สอบถามความรู้เกี่ยวกับการนำไปใช้ทางคลินิกของกลุ่มยาปฏิชีวนะฉันมั่นใจว่าจะตอบอาจารย์ได้ถูกต้อง",
    "เมื่อฝึกปฏิบัติการดูแลผู้ป่วยหากอาจารย์สอบถามความรู้เกี่ยวกับอาการไม่พึงประสงค์ของกลุ่มยาปฏิชีวนะฉันมั่นใจว่าจะตอบอาจารย์ได้ถูกต้อง",
    "เมื่อฝึกปฏิบัติการดูแลผู้ป่วยหากอาจารย์สอบถามความรู้เกี่ยวกับการพยาบาลที่สำคัญของกลุ่มยาปฏิชีวนะฉันมั่นใจว่าจะตอบอาจารย์ได้ถูกต้อง",
    "เมื่อฝึกปฏิบัติการดูแลผู้ป่วยผู้ป่วยฉันมั่นใจว่าฉันสามารถตรวจสอบคำสั่งการใช้ยาปฏิชีวนะของแพทย์ได้อย่างถูกต้อง",
    "เมื่อฝึกปฏิบัติการดูแลผู้ป่วยผู้ป่วยฉันมั่นใจว่าฉันจะทำการตรวจสอบประวัติการแพ้ยาของผู้ป่วยก่อนบริหารยาปฏิชีวนะ",
    "เมื่อฝึกปฏิบัติการดูแลผู้ป่วยหอผู้ป่วยฉันมั่นใจว่าฉันจะเตรียมยาและบริหารยาโดยคำนึงถึงความถูกต้องและความปลอดภัยของผู้ป่วย",
    "เมื่อฝึกปฏิบัติการดูแลผู้ป่วยผู้ป่วยฉันมั่นใจว่าฉันสามารถบริหารยาปฏิชีวนะให้แก่ผู้ป่วย โดยการสอบถามชื่อ สกุล และแจ้งวัตถุประสงค์การให้ยาก่อนการให้ยาทุกครั้ง",
    "เมื่อฝึกปฏิบัติการดูแลผู้ป่วยผู้ป่วยฉันมั่นใจว่าฉันจะบันทึกการให้ยาใน Medical Administration Record (MAR) ทุกครั้ง",
    "ระหว่างการฝึกปฏิบัติงานบนหอผู้ป่วยฉันมั่นใจว่าฉันสามารถให้คำแนะนำ ผู้ป่วยและญาติ เกี่ยวกับการใช้ยาปฏิชีวนะ เช่น วิธีการรับประทานยา ข้อบ่งใช้ อาการข้างเคียง และข้อควรระวังได้",
    "ฉันมั่นใจว่าฉันสามารถประเมินผลและติดตามการอาการผู้ป่วย ก่อน ระหว่างและหลังให้ยาได้เหมาะสม",
    "ฉันมั่นใจว่าหากพบผู้ป่วยเกิดอาการไม่พึงประสงค์จากการใช้ยาปฏิชีวนะฉันจะรายงานให้อาจารย์นิเทศหรือพยาบาลบนหอผู้ป่วยทราบอย่างทันที",
    "ฉันมั่นใจว่าฉันสามารถให้คำแนะนำญาติ เพื่อน คนรู้จัก เกี่ยวกับการใช้ยาปฏิชีวนะ เช่น ชื่อยา ข้อบ่งใช้ อาการข้างเคียง และข้อควรระวังได้"
  ],
  "knowledgeQuestions": [
    {
      "text": "ยาใดจัดอยู่ในกลุ่ม Macrolide",
      "choices": [
        "1.Ofloxacin",
        "2.Neomycin",
        "3.Azithromycin",
        "4.Chloramphenicol"
      ]
    },
    {
      "text": "ยา  Clindamycin จัดอยู่ในกลุ่มใด",
      "choices": [
        "1.Lincosamide",
        "2.Sulfonamide",
        "3.Beta lactams",
        "4.Fluoroquinolone"
      ]
    },
    {
      "text": "ข้อใดเป็นกลไกการออกฤทธิ์ของยา กลุ่ม Penicillin",
      "choices": [
        "ทำลายผนังเซลล์โดยกระตุ้นกระบวนการ Autolysin",
        "ทำลายผนังเซลล์โดยกระตุ้นการทำงานของเอนไซม์ penicillinase",
        "ยับยั้งการสร้างผนังเซลล์โดยรบกวนการสังเคราะห์ DNA และ RNA",
        "ยับยั้งการสร้างผนังเซลล์โดยยับยั้งการทำงานของเอนไซม์ transpeptidase และการสร้าง peptidoglycan"
      ]
    },
    {
      "text": "ข้อใดเป็นกลไกการออกฤทธิ์ของยา Vancomycin",
      "choices": [
        "ยับยั้งการสังเคราะห์โฟเลต",
        "ยับยั้งการสังเคราะห์โปรตีนโดย",
        "ยับยั้งเอนไซม์ dihydrofolate synthase",
        "ยับยั้งการสร้างผนังเซลล์โดยจับกับส่วนปลายของD-Ala-D-Ala"
      ]
    },
    {
      "text": "ยาในข้อใดออกฤทธิ์ยับยั้งการสังเคราะห์โปรตีนของแบคทีเรียและโปรโตซัวโดยรบกวนการสังเคราะห์ DNA",
      "choices": [
        "Ofloxacin",
        "Neomycin",
        "Tetracycline",
        "Metronidazole"
      ]
    },
    {
      "text": "ยาในข้อใดออกฤทธิ์ยับยั้งการเจริญเติบโตของเชื้อแบคทีเรีย โดยจับกับหน่วยย่อยไรโบโซม 30 S",
      "choices": [
        "Lincomycin",
        "Doxycycline",
        "Roxithromycin",
        "Chloramphenicol"
      ]
    },
    {
      "text": "ยาในข้อใดออกฤทธิ์ยับยั้งการสร้างเอนไซม์ topoisomerase II และ topoisomerase II",
      "choices": [
        "Colistin",
        "Linezolid",
        "Polymyxin B",
        "Levofloxacin"
      ]
    },
    {
      "text": "ยาในข้อใดออกฤทธิ์ยับยั้งเอนไซม์ dihydropteroate synthase ขัดขวางการเปลี่ยน PABA เป็น folic acid",
      "choices": [
        "Gentamycin",
        "Cotrimoxazole",
        "Metronidazole",
        "Clavulanic acid"
      ]
    },
    {
      "text": "ยาในข้อใดออกฤทธิ์ยับยั้งการสังเคราะห์ผนังเซลล์แบคทีเรียโดยยับยั้งเอนไซม์ enol pyruvyl transferase",
      "choices": [
        "Fosfomycin",
        "Clindamycin",
        "Monobactam",
        "Nitrofurantoin"
      ]
    },
    {
      "text": "การให้ยากลุ่ม Beta-Lactamase inhibitors ร่วมกับยากลุ่ม Penicillin บางชนิดมีข้อดีอย่างไร",
      "choices": [
        "เสริมฤทธิ์ให้ยากลุ่ม Penicillin ออกฤทธิ์ได้ดีขึ้น",
        "ลดการเกิดอาการไม่พึงประสงค์จากยากลุ่ม Penicillin",
        "ยา Penicillin ถูกดูดซึมเข้าสู่กระแสเลือดได้เร็วกว่าปกติ",
        "ป้องกันการสะสมของ Penicillin ในเซลล์ไขมัน กระดูกอ่อน และฟัน"
      ]
    },
    {
      "text": "ยาในข้อใดใช้รักษาการติดเชื้อแบคทีเรียที่ผิวหนัง  และเยื่อบุต่าง ๆ (เช่น ฝี หนอง)",
      "choices": [
        "1.Aztreonam",
        "2.Dicloxacillin",
        "3.Streptomycin",
        "4.Ciprofloxacin"
      ]
    },
    {
      "text": "ยาในข้อใดใช้รักษาการติดเชื้อในระบบทางเดินอาหาร (เช่น  gastroenteritis)",
      "choices": [
        "1.Norfloxacin",
        "2.Fosfomycin",
        "3.Azithromycin",
        "4.Vaborbactam"
      ]
    },
    {
      "text": "ยาในข้อใดใช้รักษาโรคติดต่อทางเพศสัมพันธ์ เช่น ซิฟิลิส (Syphilis), หนองใน (Gonorrhea)",
      "choices": [
        "Dicloxacillin",
        "Nitrofurantoin",
        "Chloramphenicol",
        "Penicillin G Benzathine"
      ]
    },
    {
      "text": "ยาในข้อใดใช้สำหรับป้องกันโรคฉี่หนู (Leptospirosis)",
      "choices": [
        "Ofloxacin",
        "Doxycycline",
        "Clindamycin",
        "Roxithromycin"
      ]
    },
    {
      "text": "ยา Metronidazole ใช้สำหรับการรักษาโรคใด",
      "choices": [
        "รักษาเยื่อหุ้มสมองอักเสบจากเชื้อแบคทีเรียกรัมลบ",
        "รักษาการติดเชื้อของกระดูกและข้อจากเชื้อแบคทีเรียกรัมบวก",
        "รักษาช่องคลอดอักเสบจากการติดเชื้อแบคทีเรีย และTrichomonas",
        "รักษาการติดเชื้อที่ผิวหนังหรือเนื้อเยื่ออ่อนจากเชื้อ Staphylococcus"
      ]
    },
    {
      "text": "ยา SMZ-TMP (Cotrimoxazole) ใช้สำหรับการรักษาโรคในข้อใด",
      "choices": [
        "รักษาการติดเชื้อ Rickettsia",
        "รักษาการติดเชื้อระบบทางเดินปัสสาวะ",
        "รักษาการติดเชื้อแบคทีเรียที่ดื้อยาหลายขนาน",
        "รักษากระเพาะอาหารอักเสบจากเชื้อ H.pyroli"
      ]
    },
    {
      "text": "ยา Ceftriaxone ใช้สำหรับการรักษาโรค/การติดเชื้อในข้อใด",
      "choices": [
        "การติดเชื้อที่ตาและเยื่อบุตา",
        "การติดเชื้อที่หูชั้นกลาง และหูชั้นนอก",
        "การติดเชื้อของผิวหนังและโครงสร้างผิวหนังชนิดรุนแรง",
        "การติดเชื้อระบบทางเดินปัสสาวะและอวัยวะในช่องท้อง"
      ]
    },
    {
      "text": "ยา Silver sulfadiazine ใช้สำหรับการรักษาโรคหรืออาการในข้อใด",
      "choices": [
        "รักษาการติดเชื้อในกระแสเลือด",
        "รักษาการติดเชื้อแผลไฟไหม้น้ำร้อนลวก",
        "รักษาการติดเชื้อที่หูชั้นนอก และหูชั้นกลาง",
        "รักษาการติดเชื้อระบบทางเดินหายใจส่วนล่าง"
      ]
    },
    {
      "text": "ยาใดใช้รักษาโรคกระเพาะปัสสาวะอักเสบที่ไม่มีภาวะแทรกซ้อน (Cystitis, uncomplicated)",
      "choices": [
        "1.Cefazolin",
        "2.Dicloxacillin",
        "3.Tazobactam",
        "4.Nitrofurantoin"
      ]
    },
    {
      "text": "ยาใดใช้รักษาการติดเชื้อของอวัยวะในช่องท้อง และการติดเชื้อในกระแสโลหิต",
      "choices": [
        "Ceftriaxone",
        "Fosfomycin",
        "Clindamycin",
        "Tetracycline"
      ]
    },
    {
      "text": "ผู้ป่วยเด็กได้รับยา Amoxicillin ควรเฝ้าระวังอาการไม่พึงประสงค์ใด",
      "choices": [
        "ผื่นคัน ลมพิษ หายใจลำบาก",
        "ชีพจรเต้นเร็ว ความดันโลหิตสูง",
        "แพ้แสง ปวดแสบบริเวณผิวหนัง",
        "เหงือกบวม มีเลือดออกตามไรฟัน"
      ]
    },
    {
      "text": "อาการไม่พึงประสงค์ที่พบได้เมื่อให้ยา Vancomycin (IV infusion) ทางหลอดเลือดทำน้อยกว่า 1 ชั่วโมง คือข้อใด",
      "choices": [
        "ภาวะหน้าแดงตัวแดง",
        "ภาวะน้ำตาลในเลือดต่ำ",
        "ภาวะหัวใจเต้นผิดจังหวะ",
        "ภาวะเลือดออกง่ายหยุดยาก"
      ]
    },
    {
      "text": "การบริหารยากลุ่ม Cephalosporins เช่น Ceftriaxone, Ceftazidime, Cefotaxime   ผ่านทาง IV ควรระวังอาการไม่พึงประสงค์ใด",
      "choices": [
        "หลอดเลือดดำอักเสบ (Thrombophlebitis)",
        "หลอดเลือดแดงแข็งและตีบ (Atherosclerosis)",
        "ความดันโลหิตลดลงเมื่อเปลี่ยนท่า (Postural hypotension)",
        "ภาวะความดันโลหิตสูงฉุกเฉิน (Hypertensive Emergency)"
      ]
    },
    {
      "text": "ข้อใดเป็นอาการไม่พึงประสงค์ที่อาจพบได้จากการใช้ยากลุ่ม Aminoglycoside เช่น Gentamycin,  ในขนาดสูง หรือใช้เป็นระยะเวลานาน",
      "choices": [
        "ความเป็นพิษต่อหู สูญเสียการได้ยิน",
        "ความเป็นพิษต่อตับ ตับอักเสบ ตับวาย",
        "ความเป็นพิษต่อระบบประสาท ปวดตามเส้นประสาทส่วนปลาย",
        "ความเป็นพิษต่อระบบเลือด ไขกระดูกทำงานผิดปกติ เม็ดเลือดขาวต่ำ"
      ]
    },
    {
      "text": "เพราะเหตุใดจึงควรไม่ควรใช้ยา Erythromycin และ Clarithromycin ร่วมกับยาชนิดอื่น",
      "choices": [
        "ยามีคุณสมบัติยับยั้งการทำงานของเอนไซม์ที่ตับอาจเกิดปฏิกิริยาระหว่างยา",
        "ยามีคุณสมบัติจับกับโปรตีนในเลือดได้ดีทำให้ยาชนิดอื่นออกฤทธิ์ได้ช้ากว่าปกติ",
        "ยามีคุณสมบัติลดการดูดซึมยาชนิดอื่นที่ทางเดินอาหารทำให้การดูดซึมยาอื่นลดลง",
        "ยามีคุณสมบัติเพิ่มการขับถ่ายยาชนิดอื่นในทางเดินปัสสาวะทำให้ยาอื่นออกฤทธิ์ได้น้อยลง"
      ]
    },
    {
      "text": "ข้อใดเป็นอาการไม่พึงประสงค์ที่อาจพบได้จากการใช้ยา Ofloxacin",
      "choices": [
        "หูอื้อ",
        "ท้องเสีย",
        "ตัวตาเหลือง",
        "บวมปลายมือปลายเท้า"
      ]
    },
    {
      "text": "ผู้ที่ได้รับยา Doxycycline ควรระวังอาการไม่พึงประสงค์ใด",
      "choices": [
        "ความเป็นพิษต่อหู (Ototoxicity)",
        "อาการแพ้แสง (Photosensitivity)",
        "เส้นประสาทตาอักเสบ (Optic neuritis)",
        "ภาวะกรดแลคติกในเลือดสูง (Lactic acidosis)"
      ]
    },
    {
      "text": "ข้อใดเป็นอาการไม่พึงประสงค์ที่อาจพบได้จากการใช้ยากลุ่ม Sulfonamides",
      "choices": [
        "Cartilage damage กระดูกอ่อนถูกทำลาย",
        "Pulmonary toxicity ปอดอักเสบเฉียบพลัน",
        "Peripheral neuropathy ปลายประสาทอักเสบ",
        "Steven-Johnson syndrome ตุ่มพุพอง หนังลอก"
      ]
    },
    {
      "text": "ยาปฏีชีวนะใดอาจทำให้เกิดภาวะ thrombocytopenia เมื่อใช้ยามากกว่า 2 สัปดาห์",
      "choices": [
        "Linezolid",
        "Piperacillin",
        "Fosfomycin",
        "Metronidazole"
      ]
    },
    {
      "text": "ยาต่อไปนี้มีความเป็นพิษต่อไต (nephrotoxicity)ยกเว้น",
      "choices": [
        "Colistin",
        "Vancomycin",
        "Polymyxin B",
        "Levofloxacin"
      ]
    },
    {
      "text": "ผู้ป่วยโรคคอหอยอักเสบ (pharyngitis) มีประวัติแพ้ยาAmoxicillin ควรเลือกใช้การรักษาด้วยยาใด",
      "choices": [
        "Colistin",
        "Cefuroxime",
        "Vancomycin",
        "Erythromycin"
      ]
    },
    {
      "text": "พยาบาลที่ปฏิบัติงานบนหอผู้ป่วยที่มีการบริหารยากลุ่ม Penicillin เช่นAmoxicillin, Dicloxacillinควรเตรียมยาชนิดได้ไว้พร้อมใช้เสมอเมื่อเกิดอาการไม่พึงประสงค์จากการใช้ยา",
      "choices": [
        "Adrenaline",
        "Neostigmine",
        "N-Acetylcysteine",
        "Calcium gluconate"
      ]
    },
    {
      "text": "ผู้ป่วยได้รับยากลุ่ม Aminoglycoside เช่น Gentamycin, Amikacin  พยาบาลควรประเมินอาการใด",
      "choices": [
        "ผมร่วง คันตามผิวหนัง และอาการตัวตาเหลือง",
        "การมองเห็น แผลในปาก และเลือดออกง่ายหยุดยาก",
        "ความยืดหยุ่นของผิวหนัง ผื่นคัน และแผลพุพองตามร่างกาย",
        "การได้ยิน ปริมาณปัสสาวะ และอาการบวมที่หนังตาและเท้า"
      ]
    },
    {
      "text": "ผู้ป่วยได้รับยาRoxithromycin ชนิดรับประทานที่บ้านพยาบาลควรแนะนำผู้ป่วยทานยาอย่างไร",
      "choices": [
        "ควรรับประทานพร้อมอาหารเพื่อให้ยาดูดซึมได้ดี",
        "รับประทานจนหมดตามแพทย์สั่งป้องกันเชื้อดื้อยา",
        "หยุดยาชนิดอื่นระหว่างการใช้ยาป้องกันการเกิดปฏิกิริยาต่อกันระหว่างยา",
        "หากลืมทานยาให้เพิ่มยาเป็น 2 เท่าในมื้อถัดไปเพื่อรักษาระดับยาในร่างกาย"
      ]
    },
    {
      "text": "ยาปฏิชีวนะกลุ่ม Tetracyclines เช่น Tetracycline, Doxycycline ห้ามรับประทานร่วมกับผลิตภัณฑ์นมหรือยาลดกรดเพราะเหตุใด",
      "choices": [
        "นมทำลายโครงสร้างของยาและออกฤทธิ์ช้าลง",
        "นมทำให้การดูดซึมยาลดลงยาออกฤทธิ์ได้ลดลง",
        "นมทำให้เกิดการตกตะกอนยาและยาสะสมในร่างกาย",
        "นมเร่งการขับถ่ายยาทำให้ประสิทธิภาพการออกฤทธิ์ลดลง"
      ]
    },
    {
      "text": "ผู้ป่วยที่ได้รับยา Doxycycline รักษาสิว 3 เดือน พยาบาลควรให้คำแนะนำในข้อใด",
      "choices": [
        "สังเกตุอาการปากเป็นฝ้าขาว หรือตกขาวผิดปกติในผู้หญิงควรพบแพทย์",
        "ชั่งน้ำหนักทุกสัปดาห์หากมีน้ำหนักเพิ่มขึ้นมากกว่า 3 กิโลกรัมควรพบแพทย์",
        "ควรเปลี่ยนอิริยาบทช้าๆ เพื่อป้องกันอาการความดันโลหิตลดลงเมื่อเปลี่ยนท่า",
        "ควรรับประทานยาพร้อมนมหรือดื่มน้ำตามมากๆ เพื่อป้องกันการระคายเคืองทางเดินอาหาร"
      ]
    },
    {
      "text": "ผู้ที่รับยาในกลุ่ม Sulfonamides ควรแนะนำให้ดื่มน้ำอย่างน้อย 2000 ml ต่อวัน เพื่อป้องกันภาวะใด",
      "choices": [
        "อาการท้องผูก",
        "น้ำตาลในเลือดสูง",
        "การเกิดผลึกสารในปัสสาวะ",
        "ความดันโลหิตลดลงเมื่อเปลี่ยนท่า"
      ]
    },
    {
      "text": "พยาบาลควรแนะนำให้หลีกเลี่ยงการโดนแสงแดด เนื่องจากอาจเกิดผื่นแดงแสบร้อนได้ง่าย(Photosensitivity) ในผู้ป่วยที่รับประทานยาปฎิชีวะกลุ่มใด",
      "choices": [
        "Penicillin",
        "Macrolides",
        "Tetracyclines",
        "Aminoglycosides"
      ]
    },
    {
      "text": "ผู้ป่วยที่ได้รับยา Metronidazole พยาบาลควรให้คำแนะนำใด ระหว่างการใช้ยา",
      "choices": [
        "1.หลีกเลี่ยงเครื่องดื่มที่มีแอลกอฮอลเนื่องจากอาจพบอาการ disulfiram like reaction",
        "2.หลีกเลี่ยงการสัมผัสกับแสงแดด ควรกางร่มเมื่อออกที่แจ้ง เพื่อป้องกัน flu like symptom",
        "3.ควรการใช้ยาคุมกำเนิดชนิดฉีดแทนชนิดรับประทานเพื่อป้องกันการเกิดปฏิกิริยาต่อกันระหว่างยา",
        "4.ควรดื่มน้ำอย่างน้อย 1500-2000 ml/วันเพื่อป้องกันการเกิดการติดเชื้อในระบบทางเดินปัสสาวะ"
      ]
    },
    {
      "text": "ผู้ป่วยได้รับยา Colistin พยาบาลควรเฝ้าระวังอาการไม่พึงประสงค์ต่อไปนี้ ยกเว้น",
      "choices": [
        "ผื่นคัน ลมพิษ",
        "หายใจกลิ่นหวานเอียน ตัวตาเหลือง",
        "ปัสสาวะน้อยลง บวมบริเวณใบหน้า เท้า",
        "กล้ามเนื้ออ่อนแรง ชาปลายมือปลายเท้า"
      ]
    },
    {
      "text": "เมื่อจะทำการจัดเตรียมยา พยาบาลควรปฏิบัติอย่างไรสำคัญที่สุด",
      "choices": [
        "ตรวจสอบชื่อยา สารละลายที่ต้องใช้สำหรับการผสมยาในใบกำกับยา",
        "ตรวจสอบชื่อผู้ป่วย การวินิจฉัยโรค และความสอดคล้องของการสั่งยาแพทย์",
        "ตรวจสอบชื่อยากับการวินิจฉัยโรคของผู้ป่วย และบันทึกการพยาบาลจากเวรที่ผ่านมา",
        "ตรวจสอบชื่อผู้ป่วย ชื่อยา ขนาดยาและทางในการบริหารยาที่กำลังจะเตรียมกับใบสั่งยาแพทย์"
      ]
    },
    {
      "text": "ก่อนการให้ยาผู้ป่วยทุกครั้ง พยาบาลควรทำอย่างไรเป็นลำดับแรก",
      "choices": [
        "ล้างมือ",
        "สอบถามชื่อ-สกุลผู้ป่วย",
        "แจ้งวัตถุประสงค์การให้ยา",
        "สังเกตความร่วมมือของผู้ป่วยและญาติ"
      ]
    },
    {
      "text": "ภายหลังพยาบาลแจ้งวัตถุประสงค์การให้ยาปฏิชีวนะแก่ผู้ป่วย พบว่าผู้ป่วยปฏิเสธการรับยา พยาบาลควรปฏิบัติดังต่อไปนี้ ยกเว้น ข้อใด",
      "choices": [
        "แจ้งแพทย์ทราบ",
        "ให้ผู้ป่วยเซนต์ยินยอมไม่รับการรักษา",
        "อธิบายเหตุผลของการให้ยาอีกครั้งแก่ผู้ป่วย",
        "สอบถามและเปิดโอกาสให้ผู้ป่วยแจ้งเหตุผลของการปฏิเสธการรับยา"
      ]
    },
    {
      "text": "พยาบาลเดินเข้าไปในหอผู้ป่วยเพื่อเตรียมบริหารยาปฏิชีวนะชนิดรับประทานให้กับผู้ป่วยเมื่อไปถึงเตียงพบว่าผู้ป่วยกำลังนอนหลับอยู่และไม่มีป้ายข้อมือระบุตัวตน พยาบาลควรปฏิบัติอย่างไรตามหลัก Right Patient",
      "choices": [
        "สอบถามผู้ป่วยเตียงข้างเคียงเพื่อลดการรบกวนผู้ป่วย",
        "วางยาไว้ที่โต๊ะข้างเตียงเพื่อให้ผู้ป่วยรับประทานยาเองเมื่อตื่น",
        "ปลุกผู้ป่วยอย่างนุ่มนวล และสอบถามชื่อ-สกุล ให้ผู้ป่วยตอบด้วยตนเอง",
        "ดูจากป้ายชื่อที่ติดไว้ท้ายเตียงเทียบกับข้อมูลตอนรับเวรและฝากญาติเก็บไว้ให้ผู้ป่วย"
      ]
    },
    {
      "text": "ผู้ป่วยเด็กอายุ 2 ปี แพทย์ให้การรักษาด้วยยาAmoxicillin (syrup 250 mg/5ml)  พยาบาลควรแนะนำการเตรียมยาและการป้อนยาบุตรแก่ผู้ปกครองอย่างไร",
      "choices": [
        "ผสมยากับน้ำอุ่นเพื่อให้ยาละลายได้ดี",
        "ผสมยาในนมให้เด็กดื่มเพื่อลดความเฝื่อนของยา",
        "ป้อนยาด้วยช้อนตวงที่บรรจุมากับกล่องยาเพื่อให้ได้ปริมาณยาที่ถูกต้อง",
        "ป้อนยาซ้ำเป็น 2 เท่าหากเด็กอาเจียนหลังการป้อนยาเพื่อเพิ่มการยาดูดซึมผ่านทางเดินอาหาร"
      ]
    },
    {
      "text": "แพทย์สั่งจ่ายยา Ciprofloxacin (500 mg) 1 tab oral b.i.d. ให้ผู้ป่วยที่มีภาวะติดเชื้อในระบบทางเดินปัสสาวะ พยาบาลควรให้คำแนะนำเกี่ยวกับการรับประทานยาอย่างไร",
      "choices": [
        "แนะนำให้เคี้ยวยาก่อนกลืนเพื่อให้ยาแตกตัวและออกฤทธิ์ได้อย่างรวดเร็ว",
        "รับประทานยาก่อนอาการ 1 ชั่วโมง หรือ หลังอาหาร 2 ชั่วโมงให้ยาออกฤทธิ์ได้ดี",
        "กรณีลืมรับประทานยาในมื้อเช้า ให้รับประทานเพิ่มเป็น 2 เม็ด ในมื้อเย็นเพื่อคงระดับยาในเลือด",
        "รับประทานพร้อมกับนมหรือยาลดกรดในกระเพาะอาหารเพื่อลดการระคายเคืองทางเดินอาหาร"
      ]
    },
    {
      "text": "เพราะเหตใดการ draw ยา Ceftazidime หลังผสม ไม่ควร push air เข้าใน Ceftazidime vial",
      "choices": [
        "Air ทำให้ตัวยาที่ผสมแล้วเกิดการตกตะกอน",
        "ยาที่ผ่านการผสมแล้วมีระยะเวลาการคงตัวสั้นมาก Air ทำให้เสื่อมสภาพได้เร็วกว่าปกติ",
        "การผสมยากับสารละลายทำให้เกิดแก๊สคาร์บอนไดออกไซด์ใน vial, Air อาจทำให้ยาฟุ้งกระจาย",
        "Air ทำปฏิกิริยากับยาที่ผสมแล้วทำให้เกิดฟองอากาศ อาจทำให้ draw ยาได้ไม่ตรงตามปริมาณ"
      ]
    },
    {
      "text": "แพทย์มีคำสั่งให้ยา Augmentin 1.2 g IV พยาบาลควรเตรียมการบริหารยาอย่างไร",
      "choices": [
        "ผสม Dilute ยากับ NSS เท่านั้น เพื่อให้ยาคงสภาพได้ดี",
        "ห้าม pushair เข้าใน vial ยาเพื่อป้องกันยาตกตะกอน",
        "ห้ามใช้ Sterile water ในการทำละลายยา เพื่อป้องกันยาเปลี่ยนสี",
        "ใช้ D5W ในการทำละลายยา เพื่อให้ยาละลายได้ดีไม่เกิดฟองอากาศ"
      ]
    },
    {
      "text": "พยาบาลต้องบริหารยาฉีด Vancomycin ทางหลอดเลือดดำ (IV) เวลา 10.00 น. แต่เนื่องจากงานในวอร์ดล้นมือ จึงเริ่มหยดยาจริงเวลา 12.30 น. การกระทำนี้ส่งผลเสียต่อหลัก Right Time อย่างไร",
      "choices": [
        "ทำให้เกิดกลุ่มอาการ Red man syndrome ทันทีหลังได้รับยา",
        "ไม่ส่งผลเสีย เนื่องจากผู้ป่วยยังได้รับยาครบตามขนาดในวันนั้น",
        "ระดับยาในเลือดลดลงจนต่ำกว่าระดับที่ออกฤทธิ์รักษา ส่งผลให้การรักษาไม่ได้ผล",
        "ต้องเลื่อนเวลาการให้ยาชนิดอื่นด้วยเพื่อป้องกันการเกิดปฏิกิริยาต่อกันระหว่างยา"
      ]
    },
    {
      "text": "หลังพยาบาลทำการบริหารยาฉีด Benzathine penicillinIM แก่ผู้ป่วยเสร็จสิ้น  ควรปฏิบัติอย่างไรตามหลัก Right documentation",
      "choices": [
        "บันทึกในใบ MAR ตั้งแต่เตรียมยา ป้องกันความสับสนกับผู้ป่วยอื่น",
        "รอบันทึกในใบ MAR พร้อมกันกับการบันทึก nurse note ในช่วงก่อนส่งเวร",
        "บันทึกชื่อยา และเวลาในการบริหารยา หลังจากบริหารยาผู้ป่วยครบทุกคนแล้ว",
        "บันทึกชื่อยา ขนาดยา ทางในการบริหารยา เวลา และตำแหน่งฉีดยา ในใบ MAR หลังจากบริหารยา"
      ]
    }
  ],
  "knowledgeAnswerKey": [
    "3.Azithromycin",
    "1.Lincosamide",
    "ยับยั้งการสร้างผนังเซลล์โดยยับยั้งการทำงานของเอนไซม์ transpeptidase และการสร้าง peptidoglycan",
    "ยับยั้งการสร้างผนังเซลล์โดยจับกับส่วนปลายของD-Ala-D-Ala",
    "Metronidazole",
    "Doxycycline",
    "Levofloxacin",
    "Cotrimoxazole",
    "Fosfomycin",
    "เสริมฤทธิ์ให้ยากลุ่ม Penicillin ออกฤทธิ์ได้ดีขึ้น",
    "2.Dicloxacillin",
    "1.Norfloxacin",
    "Penicillin G Benzathine",
    "Doxycycline",
    "รักษาช่องคลอดอักเสบจากการติดเชื้อแบคทีเรีย และTrichomonas",
    "รักษาการติดเชื้อระบบทางเดินปัสสาวะ",
    "การติดเชื้อระบบทางเดินปัสสาวะและอวัยวะในช่องท้อง",
    "รักษาการติดเชื้อแผลไฟไหม้น้ำร้อนลวก",
    "4.Nitrofurantoin",
    "Ceftriaxone",
    "ผื่นคัน ลมพิษ หายใจลำบาก",
    "ภาวะหน้าแดงตัวแดง",
    "หลอดเลือดดำอักเสบ (Thrombophlebitis)",
    "ความเป็นพิษต่อหู สูญเสียการได้ยิน",
    "ยามีคุณสมบัติยับยั้งการทำงานของเอนไซม์ที่ตับอาจเกิดปฏิกิริยาระหว่างยา",
    "ท้องเสีย",
    "อาการแพ้แสง (Photosensitivity)",
    "Steven-Johnson syndrome ตุ่มพุพอง หนังลอก",
    "Linezolid",
    "Levofloxacin",
    "Erythromycin",
    "Adrenaline",
    "การได้ยิน ปริมาณปัสสาวะ และอาการบวมที่หนังตาและเท้า",
    "รับประทานจนหมดตามแพทย์สั่งป้องกันเชื้อดื้อยา",
    "นมทำให้การดูดซึมยาลดลงยาออกฤทธิ์ได้ลดลง",
    "สังเกตุอาการปากเป็นฝ้าขาว หรือตกขาวผิดปกติในผู้หญิงควรพบแพทย์",
    "การเกิดผลึกสารในปัสสาวะ",
    "Tetracyclines",
    "1.หลีกเลี่ยงเครื่องดื่มที่มีแอลกอฮอลเนื่องจากอาจพบอาการ disulfiram like reaction",
    "หายใจกลิ่นหวานเอียน ตัวตาเหลือง",
    "ตรวจสอบชื่อผู้ป่วย ชื่อยา ขนาดยาและทางในการบริหารยาที่กำลังจะเตรียมกับใบสั่งยาแพทย์",
    "สอบถามชื่อ-สกุลผู้ป่วย",
    "ให้ผู้ป่วยเซนต์ยินยอมไม่รับการรักษา",
    "ปลุกผู้ป่วยอย่างนุ่มนวล และสอบถามชื่อ-สกุล ให้ผู้ป่วยตอบด้วยตนเอง",
    "ป้อนยาด้วยช้อนตวงที่บรรจุมากับกล่องยาเพื่อให้ได้ปริมาณยาที่ถูกต้อง",
    "รับประทานยาก่อนอาการ 1 ชั่วโมง หรือ หลังอาหาร 2 ชั่วโมงให้ยาออกฤทธิ์ได้ดี",
    "การผสมยากับสารละลายทำให้เกิดแก๊สคาร์บอนไดออกไซด์ใน vial, Air อาจทำให้ยาฟุ้งกระจาย",
    "ผสม Dilute ยากับ NSS เท่านั้น เพื่อให้ยาคงสภาพได้ดี",
    "ระดับยาในเลือดลดลงจนต่ำกว่าระดับที่ออกฤทธิ์รักษา ส่งผลให้การรักษาไม่ได้ผล",
    "บันทึกชื่อยา ขนาดยา ทางในการบริหารยา เวลา และตำแหน่งฉีดยา ในใบ MAR หลังจากบริหารยา"
  ],
  "satisfactionGames": [
    "เกมที่ 1",
    "เกมที่ 2",
    "เกมที่ 3",
    "เกมที่ 4",
    "เกมที่ 5",
    "เกมที่ 6"
  ],
  "satisfactionDimensions": [
    "ช่วยเพิ่มความเข้าใจในเนื้อหา",
    "ความน่าสนใจของเกม",
    "ความง่ายในการใช้รูปแบบ online",
    "ความพึงพอใจในภาพรวม"
  ]
};
const steps=[{id:'profile',label:'ข้อมูลทั่วไป'},{id:'confidence',label:'ความมั่นใจ'},{id:'knowledge',label:'แบบทดสอบ'},{id:'satisfaction',label:'ความพึงพอใจ'},{id:'review',label:'สรุปผล'}];
let current=0;
let answers=loadDraft();
let submittedResult=null;
const $=id=>document.getElementById(id);
function emptyAnswers(){return {profile:{age:'',year:'',gpa:'',medAdminExp:'',wardExp:''},confidence:{},knowledge:{},satisfaction:{},suggestion:'',submittedAt:''};}
function loadDraft(){try{return Object.assign(emptyAnswers(),JSON.parse(localStorage.getItem(SURVEY_KEY)||'{}'))}catch(e){return emptyAnswers()}}
function saveDraft(){localStorage.setItem(SURVEY_KEY,JSON.stringify(answers));}
function esc(v){return String(v??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
function questionnaireUrl(){if(location.protocol!=='file:'&&location.pathname!=='/questionnaire')history.pushState(null,'','/questionnaire');}
function showSurvey(){if($('home'))$('home').classList.remove('active');if($('play'))$('play').classList.remove('active');if($('survey'))$('survey').classList.add('active');submittedResult=null;current=0;questionnaireUrl();renderSurvey();scrollTo({top:0,behavior:'smooth'});}
function renderSurvey(){const host=$('surveyPanel');if(!host)return;if(submittedResult){host.innerHTML=renderSubmitted();bindSubmitted();return;}const step=steps[current];host.innerHTML='<div class="survey-head"><div><p class="eyebrow">แบบสอบถาม</p><h1>'+surveyData.title+'</h1><p>ตอบตามความเป็นจริง ระบบจะบันทึกขึ้นฐานข้อมูลเมื่อเชื่อมต่อ Supabase แล้ว และยังเก็บฉบับร่างไว้ในเครื่องนี้ระหว่างทำแบบสอบถาม</p></div><button class="secondary" type="button" id="surveyHome">กลับหน้าเกม</button></div>'+stepper()+renderStep(step.id)+nav();$('surveyHome').onclick=()=>{if(window.showHome)window.showHome();};bindStep(step.id);bindNav();}
function stepper(){return '<div class="survey-stepper">'+steps.map((s,i)=>'<button type="button" class="'+(i===current?'active':i<current?'done':'')+'" data-step="'+i+'" aria-current="'+(i===current?'step':'false')+'"><b>'+(i+1)+'</b>'+s.label+'</button>').join('')+'</div>';}
function nav(){const back=current>0?'<button class="secondary" type="button" id="surveyPrev">ย้อนกลับ</button>':'';const next=current<steps.length-1?'<button class="primary" type="button" id="surveyNext">ถัดไป</button>':'<button class="primary" type="button" id="surveySubmit">ส่งแบบสอบถาม</button>';return '<div class="survey-actions">'+back+next+'</div><div class="survey-note" id="surveyMsg"></div>';}
function renderStep(id){if(id==='profile')return renderProfile();if(id==='confidence')return renderScaleSection('confidence','ความมั่นใจในการเรียนและการฝึกปฏิบัติ',surveyData.confidenceItems);if(id==='knowledge')return renderKnowledge();if(id==='satisfaction')return renderSatisfaction();return renderReview();}
function radio(name,value,label,checked){return '<label class="pill"><input type="radio" name="'+name+'" value="'+esc(value)+'" '+(checked===value?'checked':'')+'><span>'+esc(label)+'</span></label>';}
function renderProfile(){const p=answers.profile;return '<section class="survey-card"><h2>ส่วนที่ 1 ข้อมูลทั่วไป</h2><div class="survey-form-grid"><label>อายุ (ปี)<input name="age" inputmode="numeric" value="'+esc(p.age)+'"></label><label>ระดับผลการเรียน (GPA)<input name="gpa" inputmode="decimal" value="'+esc(p.gpa)+'"></label></div><div class="survey-field"><b>ชั้นปีการศึกษา</b><div class="pill-row">'+radio('year','ชั้นปีที่ 2','ชั้นปีที่ 2',p.year)+radio('year','ชั้นปีที่ 3','ชั้นปีที่ 3',p.year)+'</div></div><div class="survey-field"><b>ประสบการณ์การฝึกปฏิบัติการบริหารยา</b><div class="pill-row">'+radio('medAdminExp','มีประสบการณ์','มีประสบการณ์',p.medAdminExp)+radio('medAdminExp','ไม่มีประสบการณ์','ไม่มีประสบการณ์',p.medAdminExp)+'</div></div><div class="survey-field"><b>ประสบการณ์การฝึกปฏิบัติงานบนหอผู้ป่วย</b><div class="pill-row">'+radio('wardExp','มีประสบการณ์','มีประสบการณ์',p.wardExp)+radio('wardExp','ไม่มีประสบการณ์','ไม่มีประสบการณ์',p.wardExp)+'</div></div></section>';}
function renderScaleSection(key,title,items){return '<section class="survey-card"><h2>ส่วนที่ 2 '+title+'</h2><p class="survey-help">เลือกคะแนน 5 = มากที่สุด ถึง 1 = น้อยที่สุด</p><div class="scale-list">'+items.map((text,i)=>scaleItem(key,i,text,answers[key][i])).join('')+'</div></section>';}
function scaleItem(key,i,text,value){return '<div class="scale-item"><p><b>'+(i+1)+'.</b> '+esc(text)+'</p><div class="scale-options">'+surveyData.scale.map(s=>'<label><input type="radio" name="'+key+'_'+i+'" value="'+s.value+'" '+(Number(value)===s.value?'checked':'')+'><span>'+s.value+'<small>'+s.label+'</small></span></label>').join('')+'</div></div>';}
function renderGameSatisfactionInline(game,mountId){
  const host=$(mountId);if(!host)return;
  const prefix='gameSat_'+String(game?.id||'game').replace(/\W/g,'_');
  const scores={};
  host.innerHTML='<section class="survey-card game-satisfaction"><p class="eyebrow">แบบประเมินหลังจบเกม</p><h2>แบบประเมินความพึงพอใจต่อเกมการเรียนรู้ออนไลน์</h2><p class="survey-help">เกม: '+esc(game?.title||'')+' เลือกคะแนน 5 = มากที่สุด ถึง 1 = น้อยที่สุด</p><div class="scale-list">'+surveyData.satisfactionDimensions.map((text,i)=>scaleItem(prefix,i,text,'')).join('')+'</div><label class="survey-field"><b>ข้อเสนอแนะเพิ่มเติม</b><textarea id="'+prefix+'_suggestion" rows="3" placeholder="พิมพ์ข้อเสนอแนะเพิ่มเติมได้ที่นี่"></textarea></label><div class="survey-actions"><button class="primary" type="button" id="'+prefix+'_submit">ส่งแบบประเมิน</button><button class="secondary" type="button" id="'+prefix+'_skip">ข้ามแบบประเมิน</button></div><div class="survey-note" id="'+prefix+'_msg"></div></section>';
  surveyData.satisfactionDimensions.forEach((_,i)=>{
    host.querySelectorAll('input[name="'+prefix+'_'+i+'"]').forEach(el=>el.addEventListener('change',()=>{scores[i]=Number(el.value);}));
  });
  const msg=$(prefix+'_msg'),submit=$(prefix+'_submit'),skip=$(prefix+'_skip'),suggestion=$(prefix+'_suggestion');
  if(submit)submit.onclick=async()=>{
    const missing=surveyData.satisfactionDimensions.map((_,i)=>i).filter(i=>!scores[i]);
    if(missing.length){msg.textContent='กรุณาให้คะแนนให้ครบทุกหัวข้อก่อนส่งแบบประเมิน';return;}
    const payload={gameId:game?.id||'game',gameTitle:game?.title||'',scores,suggestion:suggestion?.value||'',submittedAt:new Date().toISOString()};
    try{if(window.saveGameSatisfaction)await window.saveGameSatisfaction(payload);}catch(e){msg.textContent='บันทึกขึ้น Supabase ไม่สำเร็จ: '+(e.message||e);return;}
    const key='ARD_GAME_SAT_'+payload.gameId+'_'+Date.now();
    localStorage.setItem(key,JSON.stringify(payload));
    host.innerHTML='<section class="survey-card game-satisfaction submitted-card"><div class="submitted-mark">✓</div><p class="eyebrow">ส่งแบบประเมินสำเร็จ</p><h2>ขอบคุณสำหรับความคิดเห็น</h2><p class="survey-help">ระบบบันทึกความพึงพอใจของเกมนี้เรียบร้อยแล้ว</p></section>';
  };
  if(skip)skip.onclick=()=>{host.innerHTML='<section class="survey-card game-satisfaction"><p class="survey-help">ข้ามแบบประเมินสำหรับเกมนี้แล้ว</p></section>';};
}
function renderKnowledge(){return '<section class="survey-card"><h2>แบบทดสอบความรู้และทักษะทางปัญญาด้านเภสัชวิทยา</h2><p class="survey-help">เลือกคำตอบที่คิดว่าถูกต้อง ระบบนี้ใช้เก็บคำตอบจากเอกสาร ไม่แสดงเฉลยบนหน้าผู้เรียน</p><div class="quiz-list">'+surveyData.knowledgeQuestions.map((item,i)=>'<div class="quiz-item"><p><b>'+(i+1)+'.</b> '+esc(item.text)+'</p><div class="quiz-options">'+item.choices.map(choice=>'<label><input type="radio" name="k_'+i+'" value="'+esc(choice)+'" '+(answers.knowledge[i]===choice?'checked':'')+'><span>'+esc(choice)+'</span></label>').join('')+'</div></div>').join('')+'</div></section>';}
function renderSatisfaction(){return '<section class="survey-card"><h2>แบบประเมินความพึงพอใจต่อเกมการเรียนรู้ออนไลน์</h2><p class="survey-help">ประเมินเกมที่ 1-6 โดยเลือกคะแนน 5 = มากที่สุด ถึง 1 = น้อยที่สุด</p>'+surveyData.satisfactionGames.map((game,gi)=>'<div class="satisfaction-game"><h3>'+esc(game)+'</h3><div class="scale-list">'+surveyData.satisfactionDimensions.map((text,di)=>scaleItem('satisfaction_'+gi,di,text,answers.satisfaction?.[gi]?.[di])).join('')+'</div></div>').join('')+'</section>';}
function renderReview(){const missing=missingRequired();const count=loadSubmissions().length;return '<section class="survey-card review-card"><h2>ตรวจสอบก่อนส่ง</h2><div class="summary-grid"><div><strong>'+answeredCount(answers.confidence)+'</strong><br>ข้อความมั่นใจ</div><div><strong>'+answeredCount(answers.knowledge)+'</strong><br>ข้อแบบทดสอบ</div><div><strong>'+answeredSatisfactionGames()+'</strong><br>เกมที่ประเมินแล้ว</div></div><label class="survey-field"><b>ข้อเสนอแนะเพิ่มเติม</b><textarea id="suggestion" rows="5">'+esc(answers.suggestion)+'</textarea></label>'+(missing.length?'<div class="survey-warning">ยังเหลือข้อมูลที่ควรตอบ: '+missing.join(', ')+'</div>':'<div class="survey-success">ข้อมูลครบ พร้อมส่งแบบสอบถาม</div>')+'<p class="survey-help">หลังส่ง ระบบจะบันทึกขึ้นฐานข้อมูล Supabase และเก็บสำเนาในเครื่องนี้เพื่อดาวน์โหลดสำรองได้</p><div class="survey-export-row"><button class="secondary" type="button" id="downloadCsv">ดาวน์โหลด CSV ล่าสุด</button><button class="secondary" type="button" id="downloadJson">ดาวน์โหลด JSON ล่าสุด</button><button class="secondary" type="button" id="downloadAllCsv">ดาวน์โหลด CSV ทั้งหมดในเครื่องนี้ ('+count+')</button></div></section>';}
function bindStep(id){const host=$('surveyPanel');if(id==='profile'){host.querySelectorAll('input').forEach(el=>el.addEventListener('input',()=>{answers.profile[el.name]=el.value;saveDraft()}));host.querySelectorAll('input[type=radio]').forEach(el=>el.addEventListener('change',()=>{answers.profile[el.name]=el.value;saveDraft()}));}if(id==='confidence')bindScale('confidence',surveyData.confidenceItems.length);if(id==='knowledge'){surveyData.knowledgeQuestions.forEach((_,i)=>{host.querySelectorAll('input[name="k_'+i+'"]').forEach(el=>el.addEventListener('change',()=>{answers.knowledge[i]=el.value;saveDraft()}));});}if(id==='satisfaction'){surveyData.satisfactionGames.forEach((_,gi)=>surveyData.satisfactionDimensions.forEach((_,di)=>{host.querySelectorAll('input[name="satisfaction_'+gi+'_'+di+'"]').forEach(el=>el.addEventListener('change',()=>{if(!answers.satisfaction[gi])answers.satisfaction[gi]={};answers.satisfaction[gi][di]=Number(el.value);saveDraft()}));}));}if(id==='review'){const suggestion=$('suggestion');if(suggestion)suggestion.addEventListener('input',()=>{answers.suggestion=suggestion.value;saveDraft()});const latest=()=>loadSubmissions().slice(-1)[0]||toSubmission();$('downloadCsv').onclick=()=>download('ard-survey-latest.csv',toCsv([latest()]),'text/csv;charset=utf-8');$('downloadJson').onclick=()=>download('ard-survey-latest.json',JSON.stringify(latest(),null,2),'application/json;charset=utf-8');$('downloadAllCsv').onclick=()=>download('ard-survey-all.csv',toCsv(loadSubmissions()),'text/csv;charset=utf-8');}}
function bindScale(prefix,len,custom){for(let i=0;i<len;i++){document.querySelectorAll('input[name="'+prefix+'_'+i+'"]').forEach(el=>el.addEventListener('change',()=>{if(custom)custom(i,Number(el.value));else answers[prefix][i]=Number(el.value);saveDraft();}));}}
function bindNav(){document.querySelectorAll('.survey-stepper button').forEach(btn=>btn.onclick=()=>{saveDraft();current=Number(btn.dataset.step);renderSurvey();scrollTo({top:0,behavior:'smooth'});});const prev=$('surveyPrev'),next=$('surveyNext'),submit=$('surveySubmit');if(prev)prev.onclick=()=>{current--;renderSurvey();scrollTo({top:0,behavior:'smooth'});};if(next)next.onclick=()=>{saveDraft();current++;renderSurvey();scrollTo({top:0,behavior:'smooth'});};if(submit)submit.onclick=submitSurvey;}
function missingRequired(){const missing=[];const p=answers.profile;['age','year','gpa','medAdminExp','wardExp'].forEach(k=>{if(!p[k])missing.push(profileLabel(k));});if(answeredCount(answers.confidence)<surveyData.confidenceItems.length)missing.push('ความมั่นใจ');if(answeredCount(answers.knowledge)<surveyData.knowledgeQuestions.length)missing.push('แบบทดสอบ');if(answeredSatisfactionGames()<surveyData.satisfactionGames.length)missing.push('ความพึงพอใจต่อเกม');return missing;}
function profileLabel(k){return {age:'อายุ',year:'ชั้นปี',gpa:'GPA',medAdminExp:'ประสบการณ์บริหารยา',wardExp:'ประสบการณ์หอผู้ป่วย'}[k]||k;}
function answeredCount(obj){return Object.values(obj||{}).filter(v=>v!==''&&v!==null&&v!==undefined).length;}
function answeredSatisfactionGames(){return surveyData.satisfactionGames.filter((_,gi)=>answeredCount(answers.satisfaction?.[gi])>=surveyData.satisfactionDimensions.length).length;}
function renderSubmitted(){const q=submittedResult?.quiz||{};return '<section class="survey-card submitted-card"><div class="submitted-mark">✓</div><p class="eyebrow">ส่งแบบสอบถามสำเร็จ</p><h1>ส่งข้อมูลเรียบร้อยแล้ว</h1><p class="survey-help">ระบบบันทึกคำตอบของคุณแล้ว ขอบคุณที่ร่วมทำแบบสอบถามและแบบทดสอบ</p><div class="summary-grid"><div><strong>'+(q.score??'-')+'</strong><br>คะแนนควิช</div><div><strong>'+(q.total??surveyData.knowledgeQuestions.length)+'</strong><br>คะแนนเต็ม</div><div><strong>'+(q.percent??'-')+'</strong><br>เปอร์เซ็นต์</div></div><div class="survey-actions"><button class="primary" type="button" id="newSurveyBtn">ทำแบบสอบถามใหม่</button><button class="secondary" type="button" id="surveyDoneHome">กลับหน้าเกม</button></div></section>';}
function bindSubmitted(){const again=$('newSurveyBtn'),home=$('surveyDoneHome');if(again)again.onclick=()=>{submittedResult=null;answers=emptyAnswers();localStorage.removeItem(SURVEY_KEY);current=0;renderSurvey();scrollTo({top:0,behavior:'smooth'});};if(home)home.onclick=()=>{if(window.showHome)window.showHome();};}
async function submitSurvey(){const missing=missingRequired();if(missing.length){$('surveyMsg').textContent='ยังส่งไม่ได้ กรุณาตรวจสอบ: '+missing.join(', ');return;}const submission=toSubmission();try{if(window.saveSurveySubmission)await window.saveSurveySubmission(submission);}catch(e){$('surveyMsg').textContent='บันทึกขึ้น Supabase ไม่สำเร็จ: '+(e.message||e);return;}const list=loadSubmissions();list.push(submission);localStorage.setItem(SUBMIT_KEY,JSON.stringify(list));localStorage.removeItem(SURVEY_KEY);answers=emptyAnswers();submittedResult=submission;renderSurvey();toastLocal('ส่งแบบสอบถามและบันทึกข้อมูลเรียบร้อยแล้ว');}
function gradeKnowledge(){const key=surveyData.knowledgeAnswerKey||[];if(!key.length)return {score:null,total:surveyData.knowledgeQuestions.length,percent:null,graded:false};let score=0;key.forEach((answer,i)=>{if(answer&&answers.knowledge[i]===answer)score++;});return {score,total:key.filter(Boolean).length,percent:key.filter(Boolean).length?Math.round((score/key.filter(Boolean).length)*100):null,graded:true};}
function toSubmission(){return {submittedAt:new Date().toISOString(),score:document.getElementById('score')?.textContent||'',stars:document.getElementById('stars')?.textContent||'',profile:answers.profile,confidence:answers.confidence,knowledge:answers.knowledge,quiz:gradeKnowledge(),satisfaction:answers.satisfaction,suggestion:answers.suggestion};}
function loadSubmissions(){try{return JSON.parse(localStorage.getItem(SUBMIT_KEY)||'[]')}catch(e){return[]}}
function flatSubmission(s){const row={submittedAt:s.submittedAt,score:s.score,stars:s.stars,quiz_score:s.quiz?.score??'',quiz_total:s.quiz?.total??'',quiz_percent:s.quiz?.percent??'',age:s.profile?.age||'',year:s.profile?.year||'',gpa:s.profile?.gpa||'',medAdminExp:s.profile?.medAdminExp||'',wardExp:s.profile?.wardExp||'',suggestion:s.suggestion||''};surveyData.confidenceItems.forEach((_,i)=>row['confidence_'+(i+1)]=s.confidence?.[i]||'');surveyData.knowledgeQuestions.forEach((_,i)=>row['knowledge_'+(i+1)]=s.knowledge?.[i]||'');Object.entries(s.satisfaction||{}).forEach(([game,items])=>Object.entries(items||{}).forEach(([k,v])=>{row['satisfaction_'+game+'_'+(Number(k)+1)]=v;}));return row;}
function toCsv(rows){const flat=rows.map(flatSubmission);const headers=Object.keys(flat[0]||flatSubmission(toSubmission()));const csv=[headers.join(',')].concat(flat.map(row=>headers.map(h=>csvCell(row[h])).join(','))).join('\r\n');return '\ufeff'+csv;}
function csvCell(v){const s=String(v??'');return /[",\r\n]/.test(s)?'"'+s.replace(/"/g,'""')+'"':s;}
function download(name,content,type){const blob=new Blob([content],{type});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);}
function toastLocal(msg){if(window.toast)window.toast(msg);else alert(msg);}
window.showSurvey=showSurvey;window.renderSurvey=renderSurvey;window.renderGameSatisfactionInline=renderGameSatisfactionInline;document.addEventListener('ard:game-complete',event=>{const detail=event.detail||{};renderGameSatisfactionInline(detail.game,detail.mountId||'postGameSatisfaction');});document.addEventListener('DOMContentLoaded',()=>{const b=$('surveyBtn');if(b)b.onclick=showSurvey;});
})();
