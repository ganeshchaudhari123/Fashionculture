/**
 * Google Apps Script for Fashion Culture Order Management
 * 
 * Instructions:
 * 1. Go to script.google.com and create a new project.
 * 2. Paste this code.
 * 3. Deploy > New Deployment > Web App.
 * 4. Set "Execute as" to Me, "Who has access" to Anyone.
 * 5. Copy the Web App URL and add it to your .env as VITE_GOOGLE_APPS_SCRIPT_URL.
 */

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName("Orders");
    
    // Create sheet if it doesn't exist
    if (!sheet) {
      sheet = ss.insertSheet("Orders");
      const headers = [
        "Order ID", "Date", "Customer Name", "Email", "Phone", 
        "Address", "City", "Pincode", "Payment", 
        "Products (Text)", "Total Amount", "Status"
      ];
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      sheet.setFrozenRows(1);
    }
    
    // Format products list for the sheet cell
    const productsText = data.items.map(i => 
      `${i.title} (${i.size}) x${i.quantity} @ ₹${i.price}`
    ).join(" | ");
    
    // Append data
    sheet.appendRow([
      data.orderId,
      data.orderDate,
      data.fullName,
      data.email,
      data.phone,
      data.address,
      data.city,
      data.pincode,
      data.paymentMethod,
      productsText,
      data.totalAmount,
      "Pending"
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
