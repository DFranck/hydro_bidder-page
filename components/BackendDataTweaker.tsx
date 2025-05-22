"use client"

import { Card } from "@/components/Card"
import { Icon } from "@/components/Icon"
import { ModalWindow } from "@/components/ModalWindow"
import { StyledText } from "@/components/StyledText"
import { useToasts } from "@/components/Toasts"
import { Tooltip } from "@/components/Tooltip"
import { BackendDataTweak } from "@/contract-apis/types"
import { useBackendData } from "@/contract-apis/useBackendData"
import { sanitizeJSON } from "@/lib/sanitizeJSON"
import { initialTweaks } from "@/tests/fixtures/initialTweaks"
import { json } from "@codemirror/lang-json"
import { githubDark } from "@uiw/codemirror-theme-github"
import CodeMirror from "@uiw/react-codemirror"
import sortBy from "lodash/sortBy"
import { FormEvent, MouseEvent, useEffect, useRef, useState } from "react"
import { twJoin, twMerge } from "tailwind-merge"
import { useLocalStorage } from "usehooks-ts"

const EXAMPLE_JSON = `{
  // Prefix property names with $ to overwrite instead of merge

  // Merged into \`rawBackendDataBeforeWallet.hydroMetaData\`
  hydroMetaData: {},

  // Merged into \`rawBackendDataBeforeWallet.hydroRoundData\`
  hydroRoundData: [],

  // Merged into \`rawBackendDataBeforeWallet.externalData\`
  externalData: {},

  // Merged into \`augmentedBackendDataBeforeWallet\`
  walletData: {},

  // Merged into \`augmentedBackendDataAfterWallet\`
  patchData: {},
}`

type ModalState = "closed" | "listing" | "editing" | "creating" | "editing-all"

export function BackendDataTweaker() {
  const [tweaks, setTweaks] = useLocalStorage<BackendDataTweak[]>(
    "backendDataTweaks",
    initialTweaks
  )
  const [modalState, setModalState] = useState<ModalState>("closed")
  const [editingTweakId, setEditingTweakId] = useState<string | null>(null)
  const [jsonValue, setJsonValue] = useState("")
  const [labelValue, setLabelValue] = useState("")
  const formElementRef = useRef<HTMLFormElement>(null)
  const { refetchBackendData } = useBackendData()
  const { setToasts } = useToasts()

  useEffect(() => {
    refetchBackendData()
  }, [tweaks])

  useEffect(() => {
    if (!editingTweakId) {
      return
    }

    const tweak = tweaks.find((t) => t.id === editingTweakId)

    if (tweak) {
      setLabelValue(tweak.label)
      setJsonValue(JSON.stringify(tweak.json, null, 2))
      setTimeout(() => {
        ;(formElementRef.current?.elements[0] as HTMLInputElement)?.select?.()
      }, 100)
    }
  }, [editingTweakId, tweaks])

  useEffect(() => {
    if (modalState !== "editing") {
      setEditingTweakId(null)
      setJsonValue("")
      setLabelValue("")
    }

    setToasts([])
    formElementRef.current?.reset()
  }, [modalState])

  useEffect(() => {
    if (modalState === "editing-all") {
      setJsonValue(JSON.stringify(tweaks, null, 2))
      setLabelValue("")
    }
  }, [modalState, tweaks])

  function handleSubmit(event: FormEvent) {
    event.preventDefault()

    if (modalState === "editing-all") {
      try {
        const sanitizedJSON = sanitizeJSON(jsonValue)
        const parsedTweaks = JSON.parse(sanitizedJSON)
        if (!Array.isArray(parsedTweaks)) {
          setToasts([
            {
              variant: "error",
              message: "Invalid format: Expected an array of tweaks",
            },
          ])
          return
        }
        setTweaks(parsedTweaks)
        setModalState("listing")
      } catch (e) {
        console.error({ error: e })
        setToasts([
          {
            variant: "error",
            message: `Invalid JSON: ${e instanceof Error ? e.message : "Unknown error"}`,
          },
        ])
      }
      return
    }

    if (!labelValue || !jsonValue) {
      setToasts([
        {
          variant: "error",
          message: "Please enter a label and some JSON",
        },
      ])
      return
    }

    try {
      const sanitizedJSON = sanitizeJSON(jsonValue)
      const parsedTweak = JSON.parse(sanitizedJSON)

      if (editingTweakId !== null) {
        setTweaks((prev) =>
          prev.map((t) =>
            t.id === editingTweakId
              ? { ...t, json: parsedTweak, label: labelValue }
              : t
          )
        )
      } else {
        setTweaks((prev) => [
          ...prev,
          { id: crypto.randomUUID(), json: parsedTweak, label: labelValue },
        ])
      }

      setModalState("listing")
    } catch (e) {
      console.error({ error: e })
      setToasts([
        {
          variant: "error",
          message: `Invalid JSON: ${e instanceof Error ? e.message : "Unknown error"}`,
        },
      ])
    }
  }

  function handleClickToggleDisabled(id: string, event: MouseEvent) {
    event.stopPropagation()
    setTweaks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, disabled: !t.disabled } : t))
    )
  }

  function handleClickEditTweak(id: string, event: MouseEvent) {
    event.stopPropagation()
    setModalState("editing")
    setEditingTweakId(id)
  }

  function handleClickCreateNew(event: MouseEvent) {
    event.stopPropagation()
    setModalState("creating")
  }

  function handleClickCancelEdit(event: MouseEvent) {
    event.stopPropagation()
    setModalState("listing")
  }

  function handleClickDelete(id: string, event: MouseEvent) {
    event.stopPropagation()
    if (!confirm("Are you sure you want to delete this tweak?")) return
    setTweaks((prev) => prev.filter((t) => t.id !== id))
    setModalState("listing")
  }

  function handleClickDeleteAll(event: MouseEvent) {
    event.stopPropagation()
    if (!confirm("Are you sure you want to clear all tweaks?")) return
    setTweaks([])
    setModalState("listing")
  }

  function handleClickEditAll(event: MouseEvent) {
    event.stopPropagation()
    setModalState((currentState) =>
      currentState === "editing-all" ? "listing" : "editing-all"
    )
  }

  function handleClickResetAll(event: MouseEvent) {
    event.stopPropagation()
    setTweaks(initialTweaks)
    setToasts([
      {
        variant: "success",
        message: "All tweaks have been reset to the initial state 👍",
      },
    ])
  }

  return (
    <>
      {modalState === "closed" && (
        <StyledText
          data-testid="open-tweak-modal-button"
          as="button"
          type="button"
          variant="button.circular.primary"
          onClick={() => setModalState("listing")}
          className="fixed bottom-4 right-4"
        >
          <Icon name="solid:gear" />
          <span className="sr-only">Backend Data Tweaks</span>
        </StyledText>
      )}

      <ModalWindow
        data-testid="tweak-modal"
        isOpen={modalState !== "closed"}
        className={twJoin(
          "shadow-2xl",
          modalState === "listing" &&
            "bottom-6 left-auto right-6 top-auto translate-x-0 translate-y-0"
        )}
        propsForBackdrop={{
          className: "backdrop-blur-none",
        }}
        onClose={() => setModalState("closed")}
      >
        <form
          data-testid="tweak-form"
          onSubmit={handleSubmit}
          ref={formElementRef}
        >
          <Card
            className={twMerge(
              "grid grid-rows-[min-content_auto] gap-6",
              "transition-all",
              modalState === "listing" && "max-h-[80vh] w-96",
              ["editing", "creating", "editing-all"].includes(modalState) &&
                "h-[calc(100vh-2rem)] w-[calc(100vw-2rem)]"
            )}
          >
            <div className="flex items-center justify-between">
              <StyledText
                variant="h4"
                className="cursor-default"
                onClick={() => setModalState("closed")}
              >
                Backend Data Tweaks
              </StyledText>

              <div className="flex flex-row-reverse items-center gap-3">
                <StyledText
                  variant="link"
                  onClick={() =>
                    setModalState((currentState) =>
                      currentState === "listing" ? "closed" : "listing"
                    )
                  }
                >
                  <Icon
                    name={modalState === "listing" ? "xmark" : "square-minus"}
                  />
                  <span className="sr-only">Dismiss</span>
                </StyledText>

                {modalState === "listing" && (
                  <>
                    <Tooltip tipContents="Edit all tweaks at once">
                      <StyledText variant="link" onClick={handleClickEditAll}>
                        <Icon name="solid:wrench" />
                        <span className="sr-only">Edit All</span>
                      </StyledText>
                    </Tooltip>

                    <Tooltip tipContents="Reset all tweaks to the initial state">
                      <StyledText variant="link" onClick={handleClickResetAll}>
                        <Icon name="solid:power-off" />
                        <span className="sr-only">Reset All</span>
                      </StyledText>
                    </Tooltip>
                  </>
                )}
              </div>
            </div>

            <Card.Body
              className={twMerge(
                "grid gap-6",
                ["listing", "editing-all"].includes(modalState) &&
                  "grid-cols-1",
                ["editing", "creating"].includes(modalState) &&
                  "grid-cols-[300px_auto]"
              )}
            >
              <div
                className={twMerge(
                  "grid gap-3",
                  ["listing"].includes(modalState) && "hidden",
                  ["editing-all"].includes(modalState) && [
                    "grid-rows-[auto_min-content]",
                    "h-full",
                  ],
                  ["editing", "creating"].includes(modalState) && [
                    "col-start-2 col-end-3",
                    "grid-rows-[min-content_auto_min-content]",
                  ]
                )}
              >
                {["editing", "creating"].includes(modalState) && (
                  <div>
                    <StyledText
                      data-testid="tweak-label-field"
                      variant="input.text"
                      as="input"
                      type="text"
                      name="label"
                      value={labelValue}
                      onChange={(e) => setLabelValue(e.target.value)}
                      placeholder="Label"
                      className="w-full font-mono"
                    />
                  </div>
                )}

                <div className="relative">
                  <CodeMirror
                    data-testid="tweak-json-field"
                    value={jsonValue}
                    placeholder={EXAMPLE_JSON}
                    height="100%"
                    className="absolute inset-0 overflow-hidden rounded-md border border-gray-200"
                    theme={githubDark}
                    extensions={[json()]}
                    onChange={(value) => setJsonValue(value)}
                    basicSetup={{
                      lineNumbers: true,
                      highlightActiveLineGutter: true,
                      highlightActiveLine: true,
                      bracketMatching: true,
                      closeBrackets: true,
                      autocompletion: true,
                    }}
                  />
                </div>

                {/* Buttons */}
                <div className="flex items-center justify-between">
                  <div>
                    {["editing"].includes(modalState) &&
                      editingTweakId !== null && (
                        <StyledText
                          data-testid="delete-tweak-button"
                          as="button"
                          type="button"
                          variant="button.secondary.small"
                          className="border-palette-red text-palette-red"
                          onClick={handleClickDelete.bind(null, editingTweakId)}
                        >
                          <Icon name="trash" />
                          <span>Delete</span>
                        </StyledText>
                      )}
                  </div>

                  <div className="flex flex-row-reverse items-center gap-3">
                    <StyledText
                      data-testid="save-tweak-button"
                      as="button"
                      type="submit"
                      variant="button.primary.small"
                    >
                      {modalState === "creating"
                        ? "Save New Tweak"
                        : modalState === "editing"
                          ? "Update Tweak"
                          : "Save All Tweaks"}
                    </StyledText>

                    {["editing", "creating", "editing-all"].includes(
                      modalState
                    ) && (
                      <StyledText
                        data-testid="cancel-edit-button"
                        as="button"
                        type="button"
                        variant="button.secondary.small"
                        onClick={handleClickCancelEdit}
                      >
                        Cancel
                      </StyledText>
                    )}
                  </div>
                </div>
              </div>

              <div
                data-testid="tweak-list"
                className={twMerge(
                  "col-start-1 col-end-2 row-start-1",
                  "flex flex-col gap-6",
                  modalState === "editing" ? "col-end-2" : "col-span-full",
                  modalState === "editing-all" && "hidden"
                )}
              >
                <div className="flex flex-col gap-1">
                  {sortBy(tweaks, "label").map((tweak) => {
                    const { id, label, json, disabled } = tweak
                    const isActive = editingTweakId === id
                    return (
                      <div
                        id={`tweak-${id}-button`}
                        key={id}
                        className={twMerge(
                          "relative cursor-pointer",
                          "group flex items-center justify-between gap-6",
                          "-mx-3 px-3 py-1",
                          "rounded-md hover:bg-white/10",
                          isActive && "bg-white/20"
                        )}
                        onClick={handleClickEditTweak.bind(null, id)}
                      >
                        <div
                          className={twMerge(
                            "opacity-50 transition-opacity",
                            (isActive || modalState === "listing") &&
                              "opacity-100"
                          )}
                        >
                          {label}
                        </div>

                        <div className="flex flex-row-reverse items-center gap-2">
                          <StyledText
                            id={`toggle-tweak-button-${id}`}
                            variant="link"
                            className={twJoin(
                              disabled && "opacity-50 hover:opacity-100"
                            )}
                            onClick={handleClickToggleDisabled.bind(null, id)}
                          >
                            <Icon
                              name={
                                disabled
                                  ? "toggle-large-off"
                                  : "toggle-large-on"
                              }
                            />
                          </StyledText>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {modalState === "listing" && (
                  <div>
                    <StyledText
                      variant="button.primary.small"
                      data-testid="create-tweak-button"
                      as="button"
                      type="button"
                      className="flex w-full!"
                      onClick={handleClickCreateNew}
                    >
                      Create New Tweak
                    </StyledText>
                  </div>
                )}

                {modalState === "editing" && (
                  <StyledText
                    data-testid="clear-all-tweaks-button"
                    as="button"
                    type="button"
                    variant="link"
                    className="text-xs text-palette-red"
                    onClick={handleClickDeleteAll}
                  >
                    Clear All Tweaks
                  </StyledText>
                )}
              </div>
            </Card.Body>
          </Card>
        </form>
      </ModalWindow>
    </>
  )
}
