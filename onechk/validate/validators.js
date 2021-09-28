
export function isEmailAvailable(value) {
  if (value === "") return true;

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(value.length > 10);
    }, 500);
  });
}

// export function isEmailDuplicate(value) {
//   if (value === "") return true;
//   // @blur="checkDuplicate"
//   const response = await checkDuplicateEmail(this.email);
// 	if (!response.data) {
// 		this.availableEmail = false;
// 	} else {
// 		this.availableEmail = true;
// 	}

// }


// function checkDuplicateEmail() {

// }
