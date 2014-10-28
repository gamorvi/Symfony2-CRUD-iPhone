<?php

namespace iPhone\PhoneBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use iPhone\PhoneBundle\Entity\Contact;
use Symfony\Component\HttpFoundation\Request;

class ContactController extends Controller
{
    public function indexAction()
    {
        $contact = $this->getDoctrine()
        ->getRepository('PhoneBundle:Contact')
        ->findAll(array('firstname' => 'ASC'));
        
        if (!$contact) {
            /*
            throw $this->createNotFoundException(
                'No contact stored yet'
            );
             */
            return $this->render('PhoneBundle:Contact:index.html.twig', array(
                'error' => 'No contact stored in your new iPhone yet.',
            ));
        }
        
        return $this->render('PhoneBundle:Contact:index.html.twig', array(
                'contacts' => $contact,
            ));    
      
    }

    public function newAction(Request $request)
    {
        $contact = new Contact();
        $contact ->setIsactive(1);
        $form = $this->createFormBuilder($contact)
            ->add('firstname', 'text')
            ->add('othernames', 'text', array('required'=>false) )
            ->add('lastname', 'text')
            ->add('mobile', 'text')
            ->add('save', 'submit', array('label' => 'Create New Contact'))
            ->getForm();
        $form->handleRequest($request);
        $done = '';
        if($form->isValid()){
            //$data = $form->getData();
            $manager = $this->getDoctrine()->getManager();
            $manager->persist($contact);
            $manager->flush();
            return $this->redirect($this->generateUrl('index'));
            //$done = $form["firstname"]->getData().'\'s contact was saved successfully.';
            //var_dump($form);
        }
        return $this->render('PhoneBundle:Contact:new.html.twig', array(
                'form' => $form->createView(), 'done' => $done,
            ));    
        
        

        
    }

    public function editAction(Request $request, $id )
    {
        $repo = $this->getDoctrine()->getRepository("PhoneBundle:Contact");
        $contact = $repo->find($id);
        $contact ->setIsactive(1);
        //print_r($contact);
        $form = $this->createFormBuilder($contact)
            ->add('firstname', 'text' )
            ->add('othernames', 'text', array('required'=>false))
            ->add('lastname', 'text')
            ->add('mobile', 'text')
            ->add('save', 'submit', array('label' => 'Modify Contact'))
            ->getForm();
        $form->handleRequest($request);
        $done = '';
        if($form->isValid()){
            $em = $this->getDoctrine()->getManager();
            $em->flush();
            return $this->redirect($this->generateUrl('index'));
        }
        return $this->render('PhoneBundle:Contact:edit.html.twig', array(
                'form' => $form->createView(), 'done' => $done, 
            ));    }

    public function deleteAction(Request $request, $id)
    {
        $em = $this->getDoctrine()->getManager();
        $contact = $em->getRepository('PhoneBundle:Contact')->find($id);
        if (!$contact) {
          return $this->render('PhoneBundle:Contact:delete.html.twig', 
                  array('error'=>'No contact found for id ' . $id
              ));
        }

        $form = $this->createFormBuilder($contact)
                ->add('delete', 'submit')
                ->getForm();

        $form->handleRequest($request);

        if ($form->isValid()) {
          $em->remove($contact);
          $em->flush();
          return $this->redirect($this->generateUrl('index'));
          //return new Response('The contact was deleted successfully');
        }

        return $this->render('PhoneBundle:Contact:delete.html.twig', 
                array('form' => $form->createView(), 'mobile'=>$contact->getFirstname().' '.$contact->getOthernames().' '.$contact->getlastname().' - '.$contact->getMobile(),  
        ));
    }

}
