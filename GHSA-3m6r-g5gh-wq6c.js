<script>
fetch("https://cloud.appwrite.io/v1/databases/6981d87b002e1c8dbc0d/collections/documents/documents/69981f2500182f323cd2", {
  credentials: "include",
  headers: {
    "X-Appwrite-Project": "6981d34b0036b9515a07",
    "X-Appwrite-Response-Format": "1.8.0"
  }
})
.then(r => r.json())
.then(data => {
  document.body.innerHTML = "<pre>" + JSON.stringify(data, null, 2) + "</pre>";
});
</script>
