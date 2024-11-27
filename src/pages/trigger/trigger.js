const btnTrigger = document.querySelector("#btnTrigger");
const divResult = document.querySelector("#divResult");

const downloadLogs = (logs) => {
  const blob = new Blob([logs], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "logs.txt";
  link.click();
  URL.revokeObjectURL(link.href);
}

btnTrigger.onclick = () => {
  const rpIdInput = document.querySelector("#rpIdInput");
  const epicKeyInput = document.querySelector("#epicKeyInput");

  let rpId = rpIdInput.value;
  if (rpId.includes("all")) {
    rpId = rpId.split("all/")[1].split("/")[0];
  }

  let url = `${window.location.origin}/${rpId}`;
  if (!!epicKeyInput.value) {
    url += `?epic=${epicKeyInput.value}`;
  }
  btnTrigger.style.display = "none";
  divResult.innerHTML = `Loading, this can take a while...`;

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      btnTrigger.style.display = "block";
      divResult.innerHTML = `
        <ul>
          <li><b>Success:</b> ${data.success}</li>
          <li><b>Message:</b> ${data.message}</li>
          <li><b>Data:</b> ${JSON.stringify(data.data, null, 2)}</li>
        </ul>
      `;
      const btn = document.createElement("button");
      btn.textContent = 'Download logs';
      btn.onclick = () => downloadLogs(data.logs);
      divResult.appendChild(btn);
    }).catch((err) => {
    btnTrigger.style.display = "block";
      divResult.innerHTML = err;
    });
};
