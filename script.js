// const api = "https://sopon007.github.io/sample.github.io/test.json";
  const fishes = [
        { name: "ปลาแซลม่อน", detail: { price: 50, quantity: 4, expired: "2025-08-30T00:00:00" } },
        { name: "ปลาช่อน", detail: { price: 10, quantity: 5, expired: "2025-08-23T00:00:00" } },
        { name: "ปลาทู", detail: { price: 5, quantity: 5, expired: "2025-08-24T00:00:00" } },
        { name: "ปลานิล", detail: { price: 20, quantity: 5, expired: "2025-08-20T00:00:00" } },
        { name: "ปลาหมอ", detail: { price: 1, quantity: 10, expired: "2025-08-21T00:00:00" } },
      ];
function calculate() {
  const inputValue = parseFloat(document.getElementById("inputValue").value);
  if (isNaN(inputValue) || inputValue > 1000)
    return alert("กรุณาใส่จำนวนเงินไม่เกิน 1000 บาท");
 getData(fishes, inputValue);
//   fetch(api)
//     .then((response) => response.json())
//     .then((data) => {
//       getData(data, inputValue);
//     })
//     .catch((error) => {
//       console.error("Error fetching data:", error);
//     });
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("th-TH");
}

function getData(data, inputValue) {
  const table = document.getElementById("resultTable");
  const empty = document.getElementById("emptyMessage");
  const resultBody = document.getElementById("resultBody");
  const resultTotal = document.getElementById("resultTotal");
  resultBody.innerHTML = "";
  resultTotal.innerHTML = "";

//   table.style.display = "block";
//   empty.style.display = "none";

 
  let remaining = inputValue;
  let totalBeforeDiscount = 0;
  let totalDiscount = 0;
  let rows = "";

  let salmonCount = 0;

 const validFish = data
    .filter((f) => new Date(f.detail.expired) >= new Date())
    .sort((a, b) => b.detail.price - a.detail.price);

  const purchases = [];

  validFish.forEach((fish) => {
    const price = fish.detail.price;
    const qtyAvailable = fish.detail.quantity;

    let maxBuyQty = Math.min(Math.floor(remaining / price), qtyAvailable);
    let itemTotal = maxBuyQty * price;

    if (itemTotal <= remaining && maxBuyQty > 0) {
      remaining -= itemTotal;
      totalBeforeDiscount += itemTotal;

      if (fish.name.includes("แซลม่อน")) {
        salmonCount += maxBuyQty;
      }

      purchases.push({
        name: fish.name,
        qty: maxBuyQty,
        price: price,
        total: itemTotal,
        discount: 0, // ใส่ทีหลัง
        expired: formatDate(fish.detail.expired),
      });
    }
  });

  // ตรวจสอบส่วนลดแซลม่อน
  if (salmonCount >= 2) {
    const salmonItem = purchases.find((item) =>
      item.name.includes("แซลม่อน")
    );
    if (salmonItem) {
      salmonItem.discount = 20;
      totalDiscount = 20;
    }
  }

  // แสดงผลลัพธ์ในตาราง
  purchases.forEach((item) => {
    rows += `
      <tr>
        <td>${item.name}</td>
        <td>${item.qty} ตัว</td>
        <td>${item.total} บาท</td>
        <td>${item.discount} บาท</td>
        <td>${item.expired}</td>
      </tr>
    `;
  });

  const net = totalBeforeDiscount - totalDiscount;
  const change = inputValue - net;

  resultBody.innerHTML = rows;
  resultTotal.innerHTML = `
    <p>รวมเป็นเงินซื้อปลาทั้งสิ้น: ${totalBeforeDiscount} บาท</p>
    <p>รวมได้ส่วนลด: ${totalDiscount} บาท</p>
    <p>ยอดสุทธิ (หลังหักส่วนลด): ${net} บาท</p>
    <p>เงินทอน: ${change < 0 ? 0 : change} บาท</p>
  `;
}