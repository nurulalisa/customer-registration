// SPDX-License-Identifier: MIT
pragma solidity ^0.5.0;

contract FormList {
  uint public formCount = 0;

  struct Form {
    uint id;
    string content;
    bool completed;
  }

  mapping(uint => Form) public forms;

  event FormCreated(
    uint id,
    string content,
    bool completed
  );

  event FormCompleted(
    uint id,
    bool completed
  );

  constructor() public {
    createForm("'Ex: Muhammad Ali, 679541106554, General Insurance'");
  }

  function createForm(string memory _content) public {
    formCount ++;
    forms[formCount] = Form(formCount, _content, false);
    emit FormCreated(formCount, _content, false);
  }

  function toggleCompleted(uint _id) public {
    Form memory _form = forms[_id];
    _form.completed = !_form.completed;
    forms[_id] = _form;
    emit FormCompleted(_id, _form.completed);
  }

}
