const fs = require("fs");
const PDFDocument = require("pdfkit");

const generateScholarshipPDF = (filename, name, student_id, scholarship_type, amount) => {
  const doc = new PDFDocument();

  doc.pipe(fs.createWriteStream(`uploads/scholarships/${filename}`));

  doc.fontSize(27).text(`Scholarship Application Form`, 100, 100);

  doc
    .fontSize(18)
    .text(
      `Name: ${name}\n\nStudent ID: ${student_id}\n\nScholarship Type: ${scholarship_type}\n\nAmount: ${amount} Taka`,
      100,
      200
    );

  doc.fontSize(13).text(`Student's Signature: __________________________`, 100, 500);

  doc
    .fontSize(11)
    .text(
      `                         Bangladesh University of Engineering and Technology                      `,
      100,
      700
    );

  doc.end();
};

exports.generateScholarshipPDF = generateScholarshipPDF;
