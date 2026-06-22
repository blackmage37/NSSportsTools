function cleanUpSpecialChars(str)
{
    return str
    
    .replace(/[AÁÂÃÄÅÆĀĂĄ]/g,"A")
    .replace(/[CĆĈĊČ]/g,"C")
    .replace(/[DĐ]/g,"D")
    .replace(/[EÉÊËĒĔĖĘĚ]/g,"E")
    .replace(/[GĞĠĢ]/g,"G")
    .replace(/[HĦ]/g,"H")
    .replace(/[IÍÎÏĨĪĬĮİI]/g,"I")
    .replace(/[J]/g,"J")
    .replace(/[Kĸ]/g,"K")
    .replace(/[LĻĽĿŁ]/g,"L")
    .replace(/[NŃŅŇŉŊ]/g,"N")
    .replace(/[OÓÔÕÖØŌŎŐŒ]/g,"O")
    .replace(/[P]/g,"P")
    .replace(/[RŖŘ]/g,"R")
    .replace(/[SŚŜŞŠſ]/g,"S")
    .replace(/[TŤŦ]/g,"T")
    .replace(/[UÚÛÜŨŪŬŮŰŲ]/g,"U")
    .replace(/[W]/g,"W")
    .replace(/[YŸŶ]/g,"Y")
    .replace(/[ZŻŽ]/g,"Z")
    .replace(/[^a-z0-9]/gi,''); // final clean up
  
}

function standardiseText(string) {
 
  string = string.toUpperCase();
  string = cleanUpSpecialChars(string);
  string = string.replace(' ','');
  string = string.toLowerCase();
  
  return string;
  
}