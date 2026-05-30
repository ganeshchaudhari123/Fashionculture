/**
 * Fashion Culture - Production Ready Order Integration
 * Version: 2.0
 * 
 * INSTRUCTIONS:
 * 1. Open Google Sheet. 
 * 2. Extensions > Apps Script.
 * 3. Replace all code with this.
 * 4. Deploy > New Deployment.
 * 5. Type: Web App | Execute as: Me | Access: Anyone.
 * 6. Copy URL to your .env file.
 */

function doPost(e) {
  try {
    // Log the raw data for debugging in Apps Script (View > Executions)
    Logger.log("Raw Post Data: " + e.postData.contents);
    
    var data = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("Orders");
    
    // Auto-setup sheet if missing
    if (!sheet) {
      sheet = ss.insertSheet("Orders");
      var headers = [
        "Order ID", "Date", "Customer Name", "Email", "Phone", 
        "Address", "City", "Pincode", "Payment Method", 
        "Total Amount", "Items Details", "Status"
      ];
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      sheet.setFrozenRows(1);
    }
    
    // Format items array into a readable string
    var itemsString = "";
    if (data.items && Array.isArray(data.items)) {
      itemsString = data.items.map(function(item) {
        return item.title + " (Size: " + item.size + ", Qty: " + item.quantity + ")";
      }).join(" | ");
    } else {
      itemsString = "No items found or invalid format";
    }
    
    // Append the row
    sheet.appendRow([
      data.orderId || "N/A",
      data.orderDate || new Date().toLocaleString(),
      data.fullName || "N/A",
      data.email || "N/A",
      data.phone || "N/A",
      data.address || "N/A",
      data.city || "N/A",
      data.pincode || "N/A",
      data.paymentMethod || "N/A",
      data.totalAmount || 0,
      itemsString,
      "Pending"
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({ "status": "success", "orderId": data.orderId }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (err) {
    Logger.log("Error: " + err.message);
    return ContentService.createTextOutput(JSON.stringify({ "status": "error", "message": err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
