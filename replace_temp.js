const fs = require('fs');

let d = fs.readFileSync('app/components/Navbar.tsx', 'utf8');

// Debug check 1
const regex1 = /<p className="text-xs font-black text-orange-400 uppercase tracking-widest">\{checkoutStep === 'qr' \? 'Scan & Pay via UPI' \: 'Pay Directly via UPI App'\}<\/p>/g;

console.log("Regex 1 matched?", regex1.test(d));

if (regex1.test(d)) {
    d = d.replace(/<p className="text-xs font-black text-orange-400 uppercase tracking-widest">\{checkoutStep === 'qr' \? 'Scan & Pay via UPI' \: 'Pay Directly via UPI App'\}<\/p>/g,
        `<p className="text-xs font-black text-orange-400 uppercase tracking-widest">{checkoutStep === 'qr' ? 'Scan & Pay via UPI' : checkoutStep === 'upi' ? 'Pay Directly via UPI App' : 'UPI Payment Request'}</p>`
    );
}

const regex2 = /\) \: \(\s*<div className="w-full flex-col items-center flex">\s*<div className="w-20 h-20 bg-blue-500\/10 rounded-full flex items-center justify-center text-blue-500 text-4xl mb-4">⚡<\/div>/g;
console.log("Regex 2 matched?", regex2.test(d));

d = d.replace(regex2, `) : checkoutStep === 'upi' ? (
                                 <div className="w-full flex-col items-center flex">
                                    <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-500 text-4xl mb-4">⚡</div>`);

const regex3 = /This will open your default UPI app \(GPay, PhonePe, Paytm\)<\/p>\s*<\/div>\s*\)}/g;
console.log("Regex 3 matched?", regex3.test(d));

const blockToInsert = `This will open your default UPI app (GPay, PhonePe, Paytm)</p>
                                 </div>
                             ) : (
                                 <div className="w-full flex-col items-center flex">
                                   <div className="w-20 h-20 bg-purple-500/10 rounded-full flex items-center justify-center text-purple-500 text-4xl mb-4">@</div>
                                   {!upiRequestSent ? (
                                     <>
                                       <div className={\`w-full rounded-xl border-2 overflow-hidden transition-colors focus-within:border-orange-500 \${isLight ? "bg-zinc-50 border-zinc-200" : "bg-zinc-800/80 border-zinc-700"} mb-3\`}>
                                         <input
                                           value={enteredUpiId}
                                           onChange={(e) => setEnteredUpiId(e.target.value)}
                                           className={\`w-full px-4 py-3 text-sm font-semibold bg-transparent outline-none \${isLight ? "text-zinc-900 placeholder:text-zinc-400" : "text-white placeholder:text-zinc-500"}\`}
                                           placeholder="Enter your UPI ID (e.g. 9876543210@ybl)"
                                         />
                                       </div>
                                       <button 
                                          onClick={() => {
                                            if (enteredUpiId.trim() === "") {
                                              alert("Please enter a valid UPI ID");
                                              return;
                                            }
                                            setUpiRequestSent(true);
                                          }}
                                          className="w-full py-3 px-6 bg-orange-600 hover:bg-orange-500 text-white font-bold text-sm tracking-wide uppercase rounded-xl shadow-lg shadow-orange-500/20 transition-all active:scale-95"
                                       >
                                          Continue to Request
                                       </button>
                                       <p className={\`text-xs mt-3 text-center \${isLight ? "text-zinc-500" : "text-zinc-500"}\`}>Enter the UPI ID from which you will make the payment.</p>
                                     </>
                                   ) : (
                                     <div className="text-center w-full">
                                       <p className={\`text-xs mb-3 \${isLight ? "text-zinc-600" : "text-zinc-500"}\`}>Payment request ready for <span className="font-bold text-orange-500">{enteredUpiId}</span></p>
                                       <a 
                                          href={\`upi://pay?pa=2729mohane2729@fam&pn=Art.Peak&am=\${totalPrice}&cu=INR&tn=Art.Peak%20Payment&mc=0000\`}
                                          className="w-full py-4 px-6 bg-purple-600 hover:bg-purple-500 text-white font-bold text-base tracking-wide uppercase rounded-xl shadow-lg shadow-purple-500/20 transition-all flex justify-center items-center gap-2 active:scale-95 block"
                                       >
                                          Open {enteredUpiId.includes("@") ? enteredUpiId.split("@")[1]?.toUpperCase() : "UPI"} App to Pay
                                       </a>
                                       <p className={\`text-xs mt-3 \${isLight ? "text-zinc-500" : "text-zinc-400"}\`}>Click above to automatically open your app and pay <span className="font-bold text-orange-500">₹{totalPrice.toLocaleString()}</span>. After paying, enter the UTR below.</p>
                                       <button onClick={() => setUpiRequestSent(false)} className="text-xs text-orange-500 mt-2 hover:underline">Change UPI ID</button>
                                     </div>
                                   )}
                                 </div>
                             )}`;
d = d.replace(regex3, blockToInsert);

const regex4 = /\{\/\* UPI Details \*\/\}\s*<div className/g;
console.log("Regex 4 matched?", regex4.test(d));
d = d.replace(regex4, `{/* UPI Details - Only for QR and direct UPI */}
                             {checkoutStep !== 'upi_id' && (
                               <div className`);

const regex5 = /manually after scanning\.\s*<\/p>\s*<\/div>\s*<\/div>\s*<\/div>\s*\{\/\* UTR Field \*\/\}/g;
console.log("Regex 5 matched?", regex5.test(d));

d = d.replace(regex5, `manually after scanning.
                               </p>
                             </div>
                             )}
                           </div>
                        </div>

                        {/* UTR Field */}`);

const regex6 = /\{\/\* UTR Field \*\/\}\s*<div className=/g;
console.log("Regex 6 matched?", regex6.test(d));

d = d.replace(regex6, `{/* UTR Field */}
                        {(checkoutStep !== 'upi_id' || upiRequestSent) && (
                          <>
                            <div className=`);

const regex7 = /after paying\.\s*<\/p>\s*<\/motion\.div>/g;
console.log("Regex 7 matched?", regex7.test(d));

d = d.replace(regex7, `after paying.
                            </p>
                          </>
                        )}
                     </motion.div>`);

fs.writeFileSync('app/components/Navbar.tsx', d);
console.log('Finished');
