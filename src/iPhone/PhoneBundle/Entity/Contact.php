<?php

namespace iPhone\PhoneBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Contact
 *
 * @ORM\Table()
 * @ORM\Entity(repositoryClass="iPhone\PhoneBundle\Entity\ContactRepository")
 */
class Contact
{
    /**
     * @var integer
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @var string
     *
     * @ORM\Column(name="firstname", type="string", length=32)
     */
    private $firstname;

    /**
     * @var string
     *
     * @ORM\Column(name="othernames", type="string", length=64, nullable=true)
     */
    private $othernames;

    /**
     * @var string
     *
     * @ORM\Column(name="lastname", type="string", length=32)
     */
    private $lastname;

    /**
     * @var string
     *
     * @ORM\Column(name="mobile", type="string", length=15)
     */
    private $mobile;

    /**
     * @var boolean
     *
     * @ORM\Column(name="isactive", type="boolean", options={"default":1}, nullable=true)
     */
    private $isactive;


    /**
     * Get id
     *
     * @return integer 
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set firstname
     *
     * @param string $firstname
     * @return Contact
     */
    public function setFirstname($firstname)
    {
        $this->firstname = $firstname;

        return $this;
    }

    /**
     * Get firstname
     *
     * @return string 
     */
    public function getFirstname()
    {
        return $this->firstname;
    }

    /**
     * Set othernames
     *
     * @param string $othernames
     * @return Contact
     */
    public function setOthernames($othernames)
    {
        $this->othernames = $othernames;

        return $this;
    }

    /**
     * Get othernames
     *
     * @return string 
     */
    public function getOthernames()
    {
        return $this->othernames;
    }

    /**
     * Set lastname
     *
     * @param string $lastname
     * @return Contact
     */
    public function setLastname($lastname)
    {
        $this->lastname = $lastname;

        return $this;
    }

    /**
     * Get lastname
     *
     * @return string 
     */
    public function getLastname()
    {
        return $this->lastname;
    }

    /**
     * Set mobile
     *
     * @param string $mobile
     * @return Contact
     */
    public function setMobile($mobile)
    {
        $this->mobile = $mobile;

        return $this;
    }

    /**
     * Get mobile
     *
     * @return string 
     */
    public function getMobile()
    {
        return $this->mobile;
    }

    /**
     * Set isactive
     *
     * @param boolean $isactive
     * @return Contact
     */
    public function setIsactive($isactive)
    {
        $this->isactive = $isactive;

        return $this;
    }

    /**
     * Get isactive
     *
     * @return boolean 
     */
    public function getIsactive()
    {
        return $this->isactive;
    }
}
