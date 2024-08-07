import { el, mount } from "redom";

export function spinner() {
  const spinner = el('.spinner-wrap',
     el('.spinner', 
      el('.spinner-line'), 
      el('.spinner-line'), 
      el('.spinner-line')
    )
  );

  return  spinner;
}