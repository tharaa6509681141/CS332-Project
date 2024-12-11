function isUserLoggedIn() {
    const token = localStorage.getItem("isAuthenticated");
    console.log("Auth Token:", token); // Debugging output
    return !!token; // Ensure this returns true only if the token exists
}

document.getElementById("confirmButton").addEventListener("click", function () {
  const formdata = new FormData();
  const fileInput = document.getElementById("articlePDFInput");
  const imageInput = document.getElementById("articleImageInput");

  // เพิ่มไฟล์ที่เลือก
  formdata.append("pdfFile", fileInput.files[0]);
  formdata.append("imageFile", imageInput.files[0]);

  // เพิ่มข้อมูลอื่น ๆ
  formdata.append("data", JSON.stringify({
    "author": document.getElementById("articleAuthorInput").value,
    "category": document.getElementById("articleCategory").value,
    "title": document.getElementById("articleTitleInput").value,
    "description": document.getElementById("articleDescriptionInput").value,
    "status": "pending"
  }));

  const requestOptions = {
    method: "POST",
    body: formdata,
    redirect: "follow"
  };

  fetch("/api/v1/upload/pending", requestOptions)
    .then(response => {
      if (response.status === 201) {
        // ถ้า POST สำเร็จ
        alert("การส่งข้อมูลสำเร็จ!");
        clearForm();  // รีเซ็ตฟอร์ม
      } else {
        throw new Error("เกิดข้อผิดพลาดในการส่งข้อมูล");
      }
    })
    .catch(error => {
      console.error(error);
      alert("เกิดข้อผิดพลาดในการส่งข้อมูล");
    });
});

function clearForm() {
  // ลบค่าใน input fields
  document.getElementById("articleImageInput").value = "";
  document.getElementById("articlePDFInput").value = "";
  document.getElementById("articleTitleInput").value = "";
  document.getElementById("articleAuthorInput").value = "";
  document.getElementById("articleDescriptionInput").value = "";
  document.getElementById("articleCategory").selectedIndex = 0;
}
