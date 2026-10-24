// The business details printed on the PDF catalogue (header and footer). Everything here is already public on the website.
export const COMPANY = {
  name: "INS Overseas",
  tagline: "Handmade leather and paper, Jaipur, India. Since 1995",
  addressLines: ["Jain Nasiya Road, Near Jain Hostel", "Sanganer, Jaipur - 302029, Rajasthan, India"],
  email: "Sezan@ins-overseas.com",
  phone: "+91 96804 78483",
  website: "ins-overseas.com",
  /**
   * Tax / export registration, printed in the footer of every page of the PDF. To add more, join them with " | ",
   * e.g. "GSTIN 08EPUPB3346M1ZB | IEC 1234567890". Leave it empty to print nothing.
   */
  registration: "GSTIN 08EPUPB3346M1ZB",
};
