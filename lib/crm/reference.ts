/** "ENQ-00042": what the visitor quotes and staff search by. */
export const enquiryReference = (id: number) => `ENQ-${String(id).padStart(5, "0")}`;
