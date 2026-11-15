/* =========================================================
   ARCHITECTURE MODAL
   Each "View architecture" button (data-arch="<template id>")
   copies that <template> into the shared #arch-modal dialog.
   ========================================================= */
document.addEventListener('DOMContentLoaded', function () {
    var modal = document.getElementById('arch-modal');
    if (!modal) return;
    var body = modal.querySelector('.arch-modal-body');
    var closeBtn = modal.querySelector('.arch-close');
    var lastTrigger = null;

    function open(templateId, trigger) {
        var tpl = document.getElementById(templateId);
        if (!tpl) return;
        body.innerHTML = '';
        body.appendChild(tpl.content.cloneNode(true));
        lastTrigger = trigger;
        document.body.classList.add('arch-open');
        if (typeof modal.showModal === 'function') {
            modal.showModal();
        } else {
            modal.setAttribute('open', '');
        }
        modal.scrollTop = 0;
        closeBtn.focus();
    }

    function close() {
        if (typeof modal.close === 'function' && modal.open) {
            modal.close();
        } else {
            modal.removeAttribute('open');
            onClosed();
        }
    }

    function onClosed() {
        document.body.classList.remove('arch-open');
        if (lastTrigger) lastTrigger.focus();
    }

    document.querySelectorAll('.arch-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
            open(btn.getAttribute('data-arch'), btn);
        });
    });

    closeBtn.addEventListener('click', close);
    modal.addEventListener('close', onClosed);

    // Click on the dimmed backdrop (outside the panel) closes the dialog
    modal.addEventListener('click', function (e) {
        if (e.target === modal) close();
    });

    // Fallback Escape handling for browsers without native <dialog>
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && modal.hasAttribute('open')) close();
    });
});
