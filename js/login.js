   document
        .getElementById("togglePassword")
        .addEventListener("click", function () {
          const passwordInput = document.getElementById("password");
          const isPassword = passwordInput.type === "password";
          passwordInput.type = isPassword ? "text" : "password";
          this.textContent = isPassword ? "🙈" : "👁️";
        });

      function getCookie(name) {
        let match = document.cookie.match(
          new RegExp("(^| )" + name + "=([^;]+)")
        );
        return match ? match[2] : null;
      }

      window.onload = function () {
        const savedUsername =
          getCookie("username") || sessionStorage.getItem("username");
        const savedPassword =
          getCookie("password") || sessionStorage.getItem("password");

        if (savedUsername && savedPassword) {
          document.getElementById("username").value = savedUsername;
          document.getElementById("password").value = savedPassword;
          document.getElementById("rememberMe").checked =
            document.cookie.includes("username");
        }
      };

      document
        .getElementById("loginForm")
        .addEventListener("submit", function (event) {
          event.preventDefault();

          const username = document.getElementById("username").value;
          const password = document.getElementById("password").value;
          const rememberMe = document.getElementById("rememberMe").checked;

          const validCredentials = [
            { username: "galang", password: "123" },
            { username: "yanto", password: "123" },
          ];

          const isValid = validCredentials.some(
            (cred) => username === cred.username && password === cred.password
          );

          if (isValid) {
            if (rememberMe) {
              document.cookie =
                "username=" + username + "; path=/; max-age=31536000";
              document.cookie =
                "password=" + password + "; path=/; max-age=31536000";
            } else {
              sessionStorage.setItem("username", username);
              sessionStorage.setItem("password", password);
            }

            document.querySelector(".login-container").style.display = "none";
            document.getElementById("loadingScreen").style.display = "flex";

            setTimeout(() => {
              window.location.href = "kasir.html";
            }, 2500);
          } else {
            document.getElementById("errorMessage").textContent =
              "Username atau password salah.";
          }
        });
