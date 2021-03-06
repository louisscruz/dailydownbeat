import { Modal } from 'angular2-modal/plugins/bootstrap';

export function flagContent(modal: Modal, title: string, username: string) {
  let name = title;
  if (name.length > 80) {
    name = name.slice(0, 77).concat('...');
  }
  return modal.confirm()
  .size('md')
  .isBlocking(false)
  .keyboard(27)
  .headerClass('modal-header bg-warning')
  .title('Are you sure?')
  .body(`
    <p>Are you sure that you would like to flag <b>`
    + name +
    `</b> by <b>`
    + username +
    `</b>?`
  )
  .okBtn('Flag')
  .okBtnClass('btn btn-warning')
  .cancelBtnClass('btn btn-secondary');
}

export function flagCommentContent(modal: Modal, comment) {
  return modal.confirm()
  .size('md')
  .isBlocking(false)
  .keyboard(27)
  .headerClass('modal-header bg-warning')
  .title('Are you sure?')
  .body(`
    <p>Are you sure that you would like to flag <b>`
    + comment.user.username +
    `</b>'s comment'?`
  )
  .okBtn('Flag')
  .okBtnClass('btn btn-warning')
  .cancelBtnClass('btn btn-secondary');
}

export function deleteContent(modal: Modal, title: string, username: string) {
  return modal.confirm()
  .size('md')
  .isBlocking(false)
  .keyboard(27)
  .headerClass('modal-header bg-danger')
  .title('Are you sure?')
  .body(`
    <p>Are you sure that you would like to delete the post <b>`
    + title +
    `</b>?`
  )
  .okBtn('Delete')
  .okBtnClass('btn btn-danger')
  .cancelBtnClass('btn btn-secondary');
}

export function deleteCommentContent(modal: Modal) {
  return modal.confirm()
  .size('md')
  .isBlocking(false)
  .keyboard(27)
  .headerClass('modal-header bg-danger')
  .title('Are you sure?')
  .body(`
    <p>Are you sure that you would like to delete this comment?</p>`
  )
  .okBtn('Delete')
  .okBtnClass('btn btn-danger')
  .cancelBtnClass('btn btn-secondary');
}

export function confirm(modal: Modal) {
  return modal.confirm()
  .size('lg')
  .titleHtml(`
    <div class="modal-title"
    style="font-size: 22px; color: grey; text-decoration: underline;">
    A simple Confirm style modal window</div>`)
  .body(`
    <h4>Confirm is a classic (title/body/footer) 2 button modal window that blocks.</h4>
    <b>Configuration:</b>
    <ul>
    <li>Blocks (only button click can close/dismiss)</li>
    <li>Size large</li>
    <li>Keyboard can not dismiss</li>
    <li>HTML Title</li>
    <li>HTML content</li>
    </ul>`
  );
}

export function guidelines(modal: Modal) {
  return modal.alert()
  .size('md')
  .isBlocking(false)
  .keyboard(27)
  .headerClass('modal-header bg-primary')
  .title('Content Guidelines')
  .body(`
    <div class="col-xs-12">
    <h3>Posts</h3>
    <p>First and foremost, you agree to only post content that does not break Daily Downbeat's terms and conditions of use.</p>
    <h5>What to post</h5>
    <ul>
      <li><b>On-Topic:</b> Anything that good musicians – or good artists of any kind – would find interesting. Anything that will gratify an artist's intellectual and/or creative curiosity.</li>

      <li><b>Off-Topic:</b> Most stories about politics, or crime, or sports, unless they're evidence of some interesting new phenomenon.</li>
    </ul>

    <h3>In Post Submissions</h3>
    <ul>
      <li>Please don't do things to make titles stand out, like using uppercase or exclamation points, or adding a parenthetical remark saying how great an article is. It's implicit in submitting something that you think it's important.</li>
      <li>Please submit the original source. If a post reports on something found on another site, submit the latter.</li>
      <li>If the original title begins with a number or a number and a gratuitous adjective, we'd appreciate it if you'd crop it. E.g. translate "10 Ways To Do X" to "How To Do X," and "14 Amazing Ys" to "Ys." Exception: when the number is meaningful, e.g. "The 5 Platonic Solids."</li>
      <li>Otherwise please use the original title, unless it is misleading or linkbait.</li>
    </ul>

    <h3>Comments</h3>
    <ul>
      <li>Be civil. Don't say things you wouldn't say in a face-to-face conversation. Avoid gratuitous negativity.</li>
      <li>When disagreeing, please reply to the argument instead of calling names. E.g. "That is idiotic; 1 + 1 is 2, not 3" can be shortened to "1 + 1 is 2, not 3."</li>
      <li>Please don't insinuate that someone hasn't read an article. "Did you even read the article? It mentions that" can be shortened to "The article mentions that."</li>
      <li>Please don't sign comments; they're already signed with your username. If other users want to learn more about you, they can click on it to see your profile.</li>
    </ul>
    </div>
  `)
}

export function terms(modal: Modal) {
  return modal.alert()
  .size('md')
  .isBlocking(false)
  .keyboard(27)
  .headerClass('modal-header bg-primary')
  .title('Terms and Conditions')
  .body(`
    <div class="col-xs-12">
    <h2>
    Daily Downbeat Terms and Conditions of Use
    </h2>

    <h3>
    1. Terms
    </h3>

    <p>
    By accessing Daily Downbeat, you are agreeing to be bound by these
    web site Terms and Conditions of Use, all applicable laws and regulations,
    and agree that you are responsible for compliance with any applicable local
    laws. If you do not agree with any of these terms, you are prohibited from
    using or accessing this site. The materials contained in this web site are
    protected by applicable copyright and trade mark law.
    </p>

    <h3>
    2. Use License
    </h3>

    <ol type="a">
    <li>
      Permission is granted to temporarily download one copy of the materials
      (information or software) on Daily Downbeat's web site for personal,
      non-commercial transitory viewing only. This is the grant of a license,
      not a transfer of title, and under this license you may not:

      <ol type="i">
        <li>modify or copy the materials;</li>
        <li>use the materials for any commercial purpose, or for any public display (commercial or non-commercial);</li>
        <li>attempt to decompile or reverse engineer any software contained on Daily Downbeat's web site;</li>
        <li>remove any copyright or other proprietary notations from the materials; or</li>
        <li>transfer the materials to another person or "mirror" the materials on any other server.</li>
      </ol>
    </li>
    <li>
      This license shall automatically terminate if you violate any of these restrictions and may be terminated by Daily Downbeat at any time. Upon terminating your viewing of these materials or upon the termination of this license, you must destroy any downloaded materials in your possession whether in electronic or printed format.
    </li>
    </ol>

    <h3>
    3. Disclaimer
    </h3>

    <ol type="a">
    <li>
      The materials on Daily Downbeat's web site are provided "as is". Daily Downbeat makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties, including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights. Further, Daily Downbeat does not warrant or make any representations concerning the accuracy, likely results, or reliability of the use of the materials on its Internet web site or otherwise relating to such materials or on any sites linked to this site.
    </li>
    </ol>

    <h3>
    4. Limitations
    </h3>

    <p>
    In no event shall Daily Downbeat or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption,) arising out of the use or inability to use the materials on Daily Downbeat's Internet site, even if Daily Downbeat or a Daily Downbeat authorized representative has been notified orally or in writing of the possibility of such damage. Because some jurisdictions do not allow limitations on implied warranties, or limitations of liability for consequential or incidental damages, these limitations may not apply to you.
    </p>

    <h3>
    5. Revisions and Errata
    </h3>

    <p>
    The materials appearing on Daily Downbeat's web site could include technical, typographical, or photographic errors. Daily Downbeat does not warrant that any of the materials on its web site are accurate, complete, or current. Daily Downbeat may make changes to the materials contained on its web site at any time without notice. Daily Downbeat does not, however, make any commitment to update the materials.
    </p>

    <h3>
    6. Links
    </h3>

    <p>
    Daily Downbeat has not reviewed all of the sites linked to its Internet web site and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by Daily Downbeat of the site. Use of any such linked web site is at the user's own risk.
    </p>

    <h3>
    7. Site Terms of Use Modifications
    </h3>

    <p>
    Daily Downbeat may revise these terms of use for its web site at any time without notice. By using this web site you are agreeing to be bound by the then current version of these Terms and Conditions of Use.
    </p>

    <h3>
    8. Governing Law
    </h3>

    <p>
    Any claim relating to Daily Downbeat's web site shall be governed by the laws of the State of New York without regard to its conflict of law provisions.
    </p>

    <p>
    Users are prohibited from posting links to content, in posts, comments, or elsewhere, that depicts acts or instances of illegal activity, violence, pornography, discrimination, or overtly inflammatory content. Wherever the use of any of these types of content is clearly used for the purpose of artistic license, the user may be allowed to post that content. Daily Downbeat reserves the right to edit or remove any user content for any reason. Daily Downbeat will refrain from doing this wherever possible but reserves this right to rid itself of liability for its user's content.
    </p>



    <h2>
    Privacy Policy
    </h2>

    <p>
    Your privacy is very important to us. Accordingly, we have developed this Policy in order for you to understand how we collect, use, communicate and disclose and make use of personal information. The following outlines our privacy policy.
    </p>

    <ul>
    <li>
      Before or at the time of collecting personal information, we will identify the purposes for which information is being collected.
    </li>
    <li>
      We will collect and use of personal information solely with the objective of fulfilling those purposes specified by us and for other compatible purposes, unless we obtain the consent of the individual concerned or as required by law.
    </li>
    <li>
      We will only retain personal information as long as necessary for the fulfillment of those purposes.
    </li>
    <li>
      We will collect personal information by lawful and fair means and, where appropriate, with the knowledge or consent of the individual concerned.
    </li>
    <li>
      Personal data should be relevant to the purposes for which it is to be used, and, to the extent necessary for those purposes, should be accurate, complete, and up-to-date.
    </li>
    <li>
      We will protect personal information by reasonable security safeguards against loss or theft, as well as unauthorized access, disclosure, copying, use or modification.
    </li>
    <li>
      We will make readily available to customers information about our policies and practices relating to the management of personal information.
    </li>
    </ul>

    <p>
    We are committed to conducting our business in accordance with these principles in order to ensure that the confidentiality of personal information is protected and maintained.
    </p>
    </div>
  `)
  .okBtn('Accept')
  .okBtnClass('btn btn-primary')

}
